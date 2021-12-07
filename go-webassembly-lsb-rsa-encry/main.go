package main

// 需要导入 syscall/js 包以调用 js API
import (
	"syscall/js"
	"math/rand"
	rsaRand "crypto/rand"
	"crypto/sha1"
	"crypto/rsa"
	"encoding/pem"
	"crypto/x509"
	"time"
	"strconv"
	"encoding/base64"
)

var keyMap map[string]string = make(map[string]string)
var _keyStr string = "abcdefghigklmnopqrstuvwxyz0123456789"
var canvasWidth int = 640
var canvasHeight int = 480

var publicKeyData = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAygGoUiTD+LjwZIgwFZyj
iibWNQ2LM9xZ2pjKQGP8iUBtAuAW629/Ofw8qxToMyixPrG4A7j8+KOPwYrWPGV6
Og//4zm3cG+1hQvnNUWtMjHHBY8OByUPQ6/T8XHER1DxFBfnWfFLZ1yFX6oNNuvt
LgOreI6ehehJd5IB/4mOjMvFEBgOEejado2n55VNdcFpdQ3RcvGV+f/rl/lsIM08
QvL3lc5gqawj53sW9YZi1DL/uN48R+ghvAYhtx2jpHDBvlH1NCF1rU6CynYsgV9Q
Iksv0ihwl4T+k5F9ir0uv0WIS6kKKS1SRpAprRKunos4PlE8l2+jC6LaJUPhDZlj
/wIDAQAB
-----END PUBLIC KEY-----
`
	var privateKeyData = `
-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAygGoUiTD+LjwZIgwFZyjiibWNQ2LM9xZ2pjKQGP8iUBtAuAW
629/Ofw8qxToMyixPrG4A7j8+KOPwYrWPGV6Og//4zm3cG+1hQvnNUWtMjHHBY8O
ByUPQ6/T8XHER1DxFBfnWfFLZ1yFX6oNNuvtLgOreI6ehehJd5IB/4mOjMvFEBgO
Eejado2n55VNdcFpdQ3RcvGV+f/rl/lsIM08QvL3lc5gqawj53sW9YZi1DL/uN48
R+ghvAYhtx2jpHDBvlH1NCF1rU6CynYsgV9QIksv0ihwl4T+k5F9ir0uv0WIS6kK
KS1SRpAprRKunos4PlE8l2+jC6LaJUPhDZlj/wIDAQABAoIBAHIcX5YPeLie2AUi
PW9n7aYT7DtJ7FGebw+h8dZP5Q8vWqUeKzRR5p+90hOemtCTcxSEVfucWyKlWoat
Q/oYJOR5t0YHi40zPWnr4G7ibkUFg3Sra/QzRh0pTON+La9PlO+R1TmkqcC4rgrt
R8u3mGK+5fUTM49XOXEXBJPyg5kaXQpiA4BoIRdRnCSitNxWA8kxMkQYJYlwAYab
cKo4Ik/J6+YGG7m2FtrUAWpWVUMBzEYOmGJ7JhSJ1u0UC/Oh1HOS1xlGopkmexbd
EygY3hTNWzHmYaYcYQs0f+8aVcVL64Gm0dtqvAHNnBvudMThhQgdYPc39mNLbrwI
ks4uS8ECgYEA9XfvcGKsNrHA0nqoPUPMT0Nfvv/4XCaKOYk25brH4LbqJPm6CiU6
uNlKFQsxzHPmx7OEK7EYVVZCbSO9s4t/xCzDVNbOZ9kDL6bkTX9DArLE4d6IRF/1
WW/AlNPuwVgxl0kcJILFtLqA1WoC5UWMhbYe2YB/Q3rCozmn0AiwyqECgYEA0qxd
KClKAMIsrB0WJ9gZEsJOpFi4q4g6T1BwT40Xj6Ul6o6DHi6hFhPgZAstqmnY0ANz
ezQ2yxtIm7zSy7S+nwDUycjY9riJcomc/YQZNA2QVM16hEv84VLwH1MVV2wkTb41
DWjbcg/ZNofZHl9AQIw7es+R3mmtDN+8BZOZSp8CgYBHtwmaUQm1VQtbswAyHfuz
8KApgklCSvQ5SRBj38UDrw0LTnZ+/k+Ar+MH8ORUskvrblQgG7ZbQD9Z+YYzzX6/
hsBuqe9Vwb4/jsfGqHagdDA3OTegmlRpE9A06xInJKggZfi15gry+UYok7dS2pXq
fsHWk8capOP2oiKYEeHs4QKBgF2KcLaDVrtte/5Tz+GTHtbodZidWCm5jAJpeeSo
hfye3G4AJxHArH+sBacGG5md88mwrpbWwTl/fMbBmWsfbsAU02ZhCozJtSWpGo6q
F7K4DwzIS4zwXHEDrWCLOF+fwaLPQKkalM1ZYh3HRc0ph9LhMQu/nEn/6/laYhar
yZWLAoGASvCrpFKn0qllMKNUetBmYFpgtjmnNuW7l0xT2UftkW6AuFjU19gKgXhe
I+uZciHQ8kIUHfNLYBbhETsF3iqsklKfeoIr23zYHLE5GpoC151IpKf4guoPbCHX
a1oCDuZm//f5HMePb9juJN0WR//d5jWuizAycZf41XoEd8Bqydg=
-----END RSA PRIVATE KEY-----
`

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
		"rsaOAEP": encryRsaOAEP("hello, EncryptOAEP"),
	}
}

func encryRsaOAEP(message string) string {
	pubKeyBlock, _ := pem.Decode([]byte(publicKeyData))
	hash := sha1.New()
	random := rsaRand.Reader
	msg := []byte(message)
	var pub *rsa.PublicKey
	pubInterface, parseErr := x509.ParsePKIXPublicKey(pubKeyBlock.Bytes)
	if parseErr != nil {
		println("Load public key error")
	}
	pub = pubInterface.(*rsa.PublicKey)
	encryptedData, encryptErr := rsa.EncryptOAEP(hash, random, pub, msg, nil)
	if encryptErr != nil {
		println("Encrypt data error")
	}
	encodedData := base64.StdEncoding.EncodeToString(encryptedData)
	// println(encodedData)
	return encodedData
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