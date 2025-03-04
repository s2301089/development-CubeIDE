# UART_Arduinoライブラリ(自作)

### Keil StudioのSerialCtrlのようなライブラリの使用方法+α
1. `UART_Arduinoライブラリ`の最新バージョンをダウンロード  
> `teams`等にある場合が多い。  
> またｈ`github`上にある。[ここ](https://github.com/s2301089/development-F446RE/tree/main/UART_Arduino)からダウンロード。  
2. ダウンロードした`ヘッダファイル`を`プロジェクト`-`Core`-`Inc`に、`ソースファイル`を`プロジェクト`-`Core`-`Src`に移動。  
3. 使用したいソースファイル内等でヘッダファイルを`Include`する。  
4. 使用する`USART`を`.iocファイル`で設定しコードを生成。  
5. 使用する関数を記述。
> 中には`printf`を使用する関数も含まれているため、`printf`を`UART通信`で使用できるようにしておく。[参考](./chapter_2.md)  
6. `manydef.h`はピンを簡単にしたもの。
> 例
>> `GPIOA`→`PA`,`GPIO_PIN_0`→`P0`  

**使用例**
`main.c`  
```c
// 略
/* USER CODE BEGIN Includes */
#include <stdio.h>
#include "USART_Arduino.h"
/* USER CODE END Includes */
// 中略
    /* USER CODE BEGIN 1 */
    setbuf(stdout,NULL);
    /* USER CODE END 1 */
// 中略
    /* USER CODE BEGIN 2 */
    getdata data;
    /* USER CODE END 2 */
// 中略
    /* USER CODE BEGIN WHILE */
    while (1)
    {
    /* USER CODE END WHILE */
    /* USER CODE BEGIN 3 */
        if(getData(&huart1,&data) == 0){
            AllShowP(data);
        }
    }
    /* USER CODE END 3 */
// 中略
    /* USER CODE BEGIN 4 */
    int _write(int file,char *ptr,int len){
        HAL_UART_Transmit(&huart2, (uint8_t *)ptr, len, 10);
        return len;
    }
    /* USER CODE END 4 */
// 略
```  
上記の使用例では、`printf`を`USART2`で使用できるようにし、`Arduino`との`UART通信`に`USART1`を使用している。また、`getdata`型の`data`という名前の構造体変数を宣言し、`getData関数`に引数として`data`のアドレスを渡している。  
|`getData`の戻り値(`int`型)|        意味        |
|:-----------------------:|:-------------------|
|            0            |構造体に値が格納された|
|           -1            |先頭データではない値  |  
`AllShowP`は各アナログ値と押されているボタンを表示する関数。使用例にはないが`AllShow`は各アナログ値とすべてのボタンの状態を`0/1`で表示する関数。表示はすべて`printf`で行われる。  