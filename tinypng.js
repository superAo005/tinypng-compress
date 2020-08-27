const fs = require('fs')
const path = require('path')
const tinify = require('tinify')
tinify.key = "cnTL7cgyyHHyX1Rl4RGHhVlGtx5k1qCQ"

const fileDisplay = function (filePath) {
    if (!filePath) return
    if (/node_modules/.test(filePath)) return
    fs.stat(filePath, (error, stats) => {
        if (error) {
            console.warn(`解析路径（${filePath}）失败`)
            return
        }
        const isFile = stats.isFile()
        const isDir = stats.isDirectory()
        if (isDir) {
            fs.readdir(filePath, (err, files) => {
                if (err) {
                    console.warn(`读取文件夹（${filePath}）失败`)
                    return
                }
                files.forEach(fileName => {
                    const fileDir = path.join(filePath, fileName)
                    fileDisplay(fileDir)
                })
            })
        } else if (isFile) {
            if (/[\s\S]*\.(png|jpe?g)$/.test(filePath)) {
                console.log(`解析图像：${filePath}`)
                const source = tinify.fromFile(filePath);
                source.toFile(filePath).then(() => console.log(`转化完成：${filePath}`))
            }
        }
    })
}

const tinypng = function (filePath) {
    console.log('======== 密钥验证 ========')
    tinify.validate(function(err) {
        if (err) throw err;
        const compressionsThisMonth = tinify.compressionCount
        console.log(`本月剩余转化次数：${500 - compressionsThisMonth}`)
        if (compressionsThisMonth >= 500) {
            console.log('本月免费次数已用完，请下月再次使用，或联系管理员更换密钥 >_<')
            return
        }
        console.log('======== 解析开始 ========')
        if (Array.isArray(filePath)) {
            filePath.forEach(path => fileDisplay(path))
        } else if (typeof filePath === 'string') {
            fileDisplay(filePath)
        }
    })
}

module.exports = tinypng
