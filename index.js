const { default: puppeteer } = require('puppeteer')
const { writeFile, readFile } = require('fs/promises')
const { load } = require('cheerio')

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

const main = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        ignoreDefaultArgs: ['--enable-automation'],
        defaultViewport: {
            height: 768,
            width: 1440
        }
    })
    console.log("browser launched")

    const page = await browser.newPage()
    console.log("new page opened")

    await page.goto('https://www.nike.com/in/w/new-3n82y')
    console.log("visited nike products page")
    // const $ = load(await page.content())
    // const aTag = $('a[data-path="new featured main:new featured:new arrivals main"]')
    // const href = aTag.attr('href')
    // await page.goto(href)
    // console.log("on new arrivals page")
    const productsData = []
    const $ = load(await page.content())
    $('div[class="product-card__body"]').each((_, el) => {
        productsData.push({
            name: $(el).find('.product-card__title').text(),
            description: $(el).find('.product-card__subtitle').text(),
            price: $(el).find('.product-card__price').text(),
            image: $(el).find('.wall-image-loader img').attr('src')
        })
    })
    await browser.close()
    await writeFile('products.json', JSON.stringify(productsData))

}

main();