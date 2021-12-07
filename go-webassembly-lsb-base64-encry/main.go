package main

// 需要导入 syscall/js 包以调用 js API
import (
	"syscall/js"
	"math/rand"
	"time"
	"strconv"
	"encoding/base64"
)

var keyMap map[string]string = make(map[string]string)
var _keyStr string = "abcdefghigklmnopqrstuvwxyz0123456789"
var canvasWidth int = 640
var canvasHeight int = 480

func getElementById(id string) js.Value {
	return js.Global().Get("document").Call("getElementById", id)
}

func mergeData(this js.Value, args []js.Value) interface{} {
	// 根据key获取同一个随机字符串
	var strKey string = (args[0]).String()

	video := getElementById("video")
	tempCanvas := js.Global().Get("document").Call("createElement", "canvas")
	tempCtx := tempCanvas.Call("getContext", "2d")
	canvas := getElementById("canvas")
	ctx := canvas.Call("getContext", "2d")
	tempCanvas.Set("width", canvasWidth)
	tempCanvas.Set("height", canvasHeight)
	tempCtx.Call("drawImage", video, 0, 0, canvasWidth, canvasHeight)

	encryptStr := randomStr(strKey)
	println("随机字符串：" + encryptStr)
	var binaryKey string = toBinaryStr(encryptStr)
	imageData := tempCtx.Call("getImageData", 0, 0, canvasWidth, canvasHeight)
	uint8Data := imageData.Get("data")
	bufferData := uint8Data.Get("buffer")
	dataViewData := js.Global().Get("DataView").New(bufferData)
	var strLen int = len(binaryKey)
	var pos int = 0
	for pos < strLen {
		var index int = pos * 4
		bit := js.ValueOf(dataViewData.Call("getUint8", index)).Int()
		asciiBit := int64(bit)
		var bytes string = strconv.FormatInt(asciiBit, 2)
		var sliceStr string = ("00000000")[len(bytes) : 8] + bytes
		sliceStr = sliceStr[0 : 7] + string(binaryKey[pos])
		num, err := strconv.ParseInt(sliceStr, 2, 64)
		if err != nil {
			println(err)
		}
		dataViewData.Call("setUint8", index, num)
		pos = pos + 1
	}
	imageData.Set("data", uint8Data)
	ctx.Call("putImageData", imageData, 0, 0)

	summary := binaryKey
	base64Summary := base64.StdEncoding.EncodeToString([]byte(summary))
	
	return map[string]interface{}{
		"summary": base64Summary,
	}
}

func randomStr(key string) string {
	if len(keyMap[key]) > 0 {
		return keyMap[key]
	}
	newKey := ""
	for i := 6; i > 0; i -- {
		pos := rand.Intn(36)
		newKey = newKey + string(_keyStr[pos])
	}
	keyMap[key] = newKey
	return keyMap[key]
}

func toBinaryStr(str string) string {
	strArr := []rune(str)
	binaryText := ""
	for i := 0; i < len(strArr); i++ {
		asciiStr := int64(strArr[i])
		var bytes string = strconv.FormatInt(asciiStr, 2)
		sliceStr := ("00000000")[len(bytes) : 8] + bytes
		binaryText += sliceStr
	}
	return binaryText
}

func registerCallbacks() {
	js.Global().Set("mergeData", js.FuncOf(mergeData))
}

func main() {
    c := make(chan struct{}, 0)
	rand.Seed(time.Now().UnixNano())
	println("go start encrypt")
    registerCallbacks()
    <-c
}