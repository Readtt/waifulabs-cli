export async function waifuLabsCLI(proc) {
    const fs = require('fs')
    const chalk = require('chalk')
    const figlet = require('figlet')
    const inquirer = require('inquirer')
    const waifulabs = require('waifulabs')
    const Canvas = require('canvas')

    let args = proc.slice(2)

    var fonts = ['', 'Ghost', 'big', 'doom']
    var font = fonts[Math.floor(Math.random() * fonts.length)];

    await console.log(
        chalk.yellow(
            figlet.textSync('WaifuLabs CLI', {
                horizontalLayout: 'full',
                font: font
            }),
        )
    );

    async function ccDir(dir, log, color) {
        if (!fs.existsSync(dir)) {
            await fs.mkdirSync(dir)
            await console.log(chalk.keyword(color).italic(`${log} Directory Created`))
        } else {
            await console.log(chalk.italic(`${log} Directory Found`))
        }
    }

    async function folderLength(dir) {
        return fs.readdirSync(dir).length
    }

    let waifusLoadingTxt = 'Waifus Loading...'

    function lbr() {
        console.log()
        console.log('--------------------------')
        console.log()
    }

    if (args[0] == '--random') {
        await ccDir('waifu/', 'Waifu', 'orange')
        const waifus = await waifulabs.generateWaifus();
        await console.log(chalk.blue(waifusLoadingTxt))
        const waifu = waifus[0];
        const big = await waifulabs.generateBigWaifu(waifu).then(await console.log(chalk.green("Waifu Chosen")))
        const imageData = big.image;
        const image = Buffer.from(imageData, 'base64');
        let waifuFolder = await folderLength('waifu/')
        await fs.writeFileSync(`waifu/BigWaifu-${waifuFolder + 1}.png`, image)
        await console.log(chalk.hex('#FFC0CB')(`Waifu Generated in 'waifu' Folder!`))
    } else if (args[0] == '--lite') {
        await ccDir('steps/', 'Steps', 'orange')
        await ccDir('steps/waifus/', 'Steps/Waifus', 'orange')
        await ccDir('steps/waifus/default', 'Steps/Waifus/Default', 'orange')
        await ccDir('steps/waifus/big', 'Steps/Waifus/Big', 'orange')
        await ccDir('steps/waifus/pillow', 'Steps/Waifus/Pillow', 'orange')
        await ccDir('steps/waifus/poster', 'Steps/Waifus/Poster', 'orange')

        let waifuFolderDef = await folderLength('steps/waifus/default/')
        let waifuFolderBig = await folderLength('steps/waifus/big/')
        let waifuFolderPIL = await folderLength('steps/waifus/pillow/')
        let waifuFolderPOS = await folderLength('steps/waifus/poster/')

        await lbr()

        await console.log(chalk.blueBright(waifusLoadingTxt))
        const canvas = Canvas.createCanvas(200 * 4, 200 * 4);
        const waifuCanvas = canvas.getContext("2d", {
            alpha: false
        });

        await lbr()

        var chosenWaifu = [null]
        for (let b = 0; b < 4; b++) {
            let allWaifus = []
            await waifulabs.generateWaifus(chosenWaifu[0], b)
                .then(waifus => {
                    allWaifus.push(waifus)
                    waifus.forEach((w, i) => {
                        Canvas.loadImage(Buffer.from(w.image, 'base64'))
                            .then(img => waifuCanvas.drawImage(img, (i % 4) * 200, Math.floor(i / 4) * 200))
                    })
                })
            chosenWaifu = []
            if (b == 0) {
                await console.log(chalk.green("Palette Loaded!"))
                await console.log(chalk.hex(`#B19CD9`)(chalk.italic(`Choose a waifu from the palette: (step ${b}.png, left to right)`)))
            } else if (b == 1) {
                await console.log(chalk.green("Colors Loaded!"))
                await console.log(chalk.hex(`#B19CD9`)(chalk.italic(`Choose a color for your waifu: (step ${b}.png, left to right)`)))
            } else if (b == 2) {
                await console.log(chalk.green("Details Loaded!"))
                await console.log(chalk.hex(`#B19CD9`)(chalk.italic(`Choose details for your waifu: (step ${b}.png, left to right)`)))
            } else if (b == 3) {
                await console.log(chalk.green("Poses Loaded!"))
                await console.log(chalk.hex(`#B19CD9`)(chalk.italic(`Choose a pose for your waifu: (step ${b}.png, left to right)`)))
            }
            await fs.writeFileSync('steps/step ' + b + '.png', canvas.toBuffer())
            let choices = []
            for (let i = 0; i < allWaifus[0].length; i++) {
                choices.push('Waifu ' + i)
            }
            let result = []
            await inquirer.prompt([{
                type: 'list',
                message: "Pick a waifu to customize:",
                name: "Waifu",
                choices: choices
            }]).then(res => {
                result.push(res)
            })
            let resSeed = result[0].Waifu.split(' ')[1]
            await chosenWaifu.push(allWaifus[0][resSeed].seeds)
            if (b == 3) {
                await inquirer.prompt([{
                    type: 'list',
                    message: "Pick how you want your waifu:",
                    name: "Waifu",
                    choices: [
                        'Default',
                        'Product',
                        'Big',
                        'All of the above + Products'
                    ]
                }]).then(res => {
                    result.push(res)
                })
                if (result[1].Waifu == 'Default') {
                    await fs.writeFileSync(`steps/waifus/default/DefaultWaifu-${waifuFolderDef + 1}.png`, Buffer.from(allWaifus[0][resSeed].image, 'base64'))
                    await console.log(chalk.hex('#FFC0CB')(`Waifu Generated in 'steps/waifus/default' Folder!`))
                } else if (result[1].Waifu == 'Product') {
                    let product = []
                    await inquirer.prompt([{
                        type: 'list',
                        message: "Pick a product",
                        name: "Waifu",
                        choices: [
                            'Pillow',
                            'Poster'
                        ]
                    }]).then(res => {
                        product.push(res)
                    })
                    if (product[0].Waifu == 'Pillow') {
                        let pillow = await waifulabs.generateProduct(allWaifus[0][resSeed].seeds, "PILLOW");
                        await fs.writeFileSync(`steps/waifus/pillow/PillowWaifu-${waifuFolderPIL + 1}.png`, Buffer.from(pillow.image, 'base64'))
                        await console.log(chalk.hex('#FFC0CB')(`Waifu Generated in 'steps/waifus/pillow' Folder!`))
                    } else if (product[0].Waifu == 'Poster') {
                        let poster = await waifulabs.generateProduct(allWaifus[0][resSeed].seeds, "POSTER");
                        await fs.writeFileSync(`steps/waifus/poster/PosterWaifu-${waifuFolderPOS + 1}.png`, Buffer.from(poster.image, 'base64'))
                        await console.log(chalk.hex('#FFC0CB')(`Waifu Generated in 'steps/waifus/poster' Folder!`))
                    }
                } else if (result[1].Waifu == 'Big') {
                    let big = await waifulabs.generateBigWaifu(allWaifus[0][resSeed].seeds)
                    await fs.writeFileSync(`steps/waifus/big/BigWaifu-${waifuFolderBig + 1}.png`, Buffer.from(big.image, 'base64'))
                    await console.log(chalk.hex('#FFC0CB')(`Waifu Generated in 'steps/waifus/big' Folder!`))
                } else if (result[1].Waifu == 'All of the above + Products') {
                    let big = await waifulabs.generateBigWaifu(allWaifus[0][resSeed].seeds)
                    let pillow = await waifulabs.generateProduct(allWaifus[0][resSeed].seeds, "PILLOW");
                    let poster = await waifulabs.generateProduct(allWaifus[0][resSeed].seeds, "POSTER");

                    await fs.writeFileSync(`steps/waifus/default/DefaultWaifu-${waifuFolderDef + 1}.png`, Buffer.from(allWaifus[0][resSeed].image, 'base64'))
                    await console.log(chalk.hex('#FFC0CB')(`Waifu Generated in 'steps/waifus/default' Folder!`))
                    await fs.writeFileSync(`steps/waifus/big/BigWaifu-${waifuFolderBig + 1}.png`, Buffer.from(big.image, 'base64'))
                    await console.log(chalk.hex('#FFC0CB')(`Waifu Generated in 'steps/waifus/big' Folder!`))
                    await fs.writeFileSync(`steps/waifus/pillow/PillowWaifu-${waifuFolderPIL + 1}.png`, Buffer.from(pillow.image, 'base64'))
                    await console.log(chalk.hex('#FFC0CB')(`Waifu Generated in 'steps/waifus/pillow' Folder!`))
                    await fs.writeFileSync(`steps/waifus/poster/PosterWaifu-${waifuFolderPOS + 1}.png`, Buffer.from(poster.image, 'base64'))
                    await console.log(chalk.hex('#FFC0CB')(`Waifu Generated in 'steps/waifus/poster' Folder!`))
                }
            }
        }
    } else if (!args[0]) {
        console.log(chalk.hex('#FFC0CB')(`COMING SOON (use: ${chalk.italic('waifulabs --lite')})`))
    }
    await process.exit(1)
}