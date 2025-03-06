# Arduinoとの通信(lib)

### Keil StudioのSerialCtrlのようなライブラリの使用方法
1. `UART_Arduinoライブラリ`の最新バージョンをダウンロード。  
> `teams`等にある場合が多い。  
> または`github`上にある。**[ここ](https://github.com/s2301089/development-F446RE/tree/main/UART_Arduino)**からダウンロード。  
2. ダウンロードした`ヘッダファイル`を`プロジェクト`-`Core`-`Inc`に、`ソースファイル`を`プロジェクト`-`Core`-`Src`に移動。  
3. 使用したいソースファイル内等でヘッダファイルを`Include`する。  
4. 使用する`USART`を`.iocファイル`で設定しコードを生成。  
> `[プロジェクト名].ioc`-`Pinout & Configuration`-`Connectivity`-`USART1`-`Mode`を`Asynchronous`、`Configuration`-`Parameter Settings`-`Basic Parameters`-`Baud Rate`を`38400`に設定。今回は`USART1`を使用した。  
5. 使用する関数を記述。  
> 中には`printf`を使用する関数も含まれているため、`printf`を`UART通信`で使用できるようにしておく。[参考](./chapter_2.md)  

**使用例1**  
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
    getdata DATA;
    /* USER CODE END 2 */
// 中略
    /* USER CODE BEGIN WHILE */
    while (1)
    {
    /* USER CODE END WHILE */
    /* USER CODE BEGIN 3 */
        if(getData(&huart1,&DATA) == 0){
            AllShowP(DATA);
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
上記の使用例では、`printf`を`USART2`で使用できるようにし、`Arduino`との`UART通信`に`USART1`を使用している。また、`getdata`型の`DATA`という名前の構造体変数を宣言し、`getData関数`に引数として`DATA`のアドレスを渡している。  

**使用例2**  
`main.c`  
```c
// 略
/* USER CODE BEGIN Includes */
#include <stdio.h>
#include "USART_Arduino.h"
#include "STprintf.h"
#include "manydef.h"
/* USER CODE END Includes */
// 略
    /* USER CODE BEGIN 2 */
    STprintf(&huart2);
    unsigned int FAFcount = 0;
    /* USER CODE END 2 */
// 略
    /* USER CODE BEGIN WHILE */
    while (1)
    {
        HAL_TIM_PWM_Start(&htim3,TIMCH_3);
        /* USER CODE END WHILE */

        /* USER CODE BEGIN 3 */
        getDataIT(&huart1);
        printf("%d %d \r\n",FAF,FAFcount);
        if(FAF == 1){
            FAFcount = 0;
            AllShow(data);
            __HAL_TIM_SET_COMPARE(&htim3,TIMCH_3,data.LY);
            HAL_GPIO_WritePin(GPIOxA, GPIO_Pin_0, 0);
        }else{
            FAFcount++;
            if(FAFcount >= TIMEOUT_MAX * 10){
                __HAL_TIM_SET_COMPARE(&htim3,TIMCH_3,0);
                HAL_GPIO_WritePin(GPIOxA, GPIO_Pin_0, 0);
                FAFcount = 0;
                printf("main timeout ");
                HAL_Delay(500);
            }
        }
    }
    /* USER CODE END 3 */
// 略
```  
上記の使用例では、`printf`を`USART2`で使用できるようにし、`Arduino`との`UART通信`に`USART1`を使用している。あらかじめライブラリ内で宣言されている構造体`data`の`LY`の値に合わせて`LED`が点灯する。FAFとはデータを受信したかどうか記録するフラグ(変数)であり、フラグに合わせてタイムアウトの処理を行っている。タイムアウトの時間や回数などは他の処理の量によって変更した。  

#### 各関数に関して  
* getData関数  
  * 引数に`UART_HandleTypeDef*`と`getdata*`をもつ。使用する`USART`の構造体変数のポインタ`UART_HandleTypeDef*`と受信したデータを入れる構造体変数のポインタ`getdata*`を渡す。  
  * `getData(&huart1,DATA);`  
  * 戻り値は、先頭データが`0xaf`であり、構造体に受信データが代入された場合は`0`、先頭データが`0xaf`でない場合は`-1`が返される。  
  * 受信にはポーリング方式を使用し、データを受信する関数。  
* getDataIT関数  
  * 引数に`UART_HandleTypeDef*`をもつ。使用する`USART`の構造体変数のポインタ`UART_HandleTypeDef*`を渡す。  
  * `getDataIT(&huart1);`  
  * 戻り値はなく、受信には割り込み使用し、データを受信する関数。  
* AllShow関数  
  * 引数に`getdata`をもつ。構造体変数`getdata`を渡す。  
  * `AllShow(data);`  
  * 戻り値はなく、構造体の中身を表示する関数。表示形式はアナログ値をもつスティックなどは整数3桁(空白埋め)で、ディジタル値をもつボタンなどは`0/1`で表示する。  
  * `printf`関数を使用するため、`printf`を使用するためのコードが必要になる。[参考](./chapter_2.md)  
* AllShowP関数  
  * 引数や戻り値は`AllShow`関数と同じである。
  * 表示形式はスティックなどは`AllShow`関数と同じだが、ボタンなどは`AllShow`関数と異なり、押されているボタンを名前で表示する。送信側の`Arduino`のシリアルモニタと同じように表示される。  

#### 内部で使用される各関数に関して  
* RevAF関数  
  * 引数に`UART_HandleTypeDef*`をもつ。使用する`USART`の構造体変数のポインタ`UART_HandleTypeDef*`を渡す。  
  * `RevAF(huart);`  
  * 戻り値は、受信したデータが先頭データ`0xaf`の場合は`0xaf`、そうでない場合は`0x00`を、そもそも受信していない場合は`0xff`を返す。  
  * ポーリング方式の際に使用される関数。  
* AddArray関数  
  * 引数に`UART_HandleTypeDef*`と`uint8_t*`をもつ。使用する`USART`の構造体変数のポインタ`UART_HandleTypeDef*`と受信したデータを入れる配列のポインタ`uint8_t*`を渡す。  
  * `AddArray(huart,Rdata);`  
  * 戻り値はなく、受信データの総数になるまで受信したデータを配列に順番に代入する。  
  * ポーリング方式の際に使用される関数。  
* HAL_UART_RxCpltCallback関数  
  * 引数に`UART_HandleTypeDef*`をもつ。この関数は受信割り込みでデータを受信した時に自動的に実行される。  
  * 戻り値はなく、`FAF`を揚げデータを受信したことを表す。また、`getData`関数の内部処理のようなことを行う。  
  * 割り込みを使用した際に使用される関数。  
* ChSUM関数  
  * 引数に`uint8_t*`をもつ。受信したデータが入った配列のポインタ`uint8_t*`を渡す。  
  * 配列の最後のデータが終端データ`0xed`であるか確認し、終端データである場合、チェックサムを行う。  
  * チェックサムとは、各スティックと各ボタンのデータの総和が送信側で計算された総和と一致しているか確認すること。送信側の計算結果も受信データに含まれている。  
  * 戻り値は、総和が一致している場合は`0xed`、そうでない場合は`0x00`、配列の最後のデータが正しくない場合は`0xff`を返す。  
  * ポーリング方式と割り込みを使用した際のどちらでも使用される関数。  
* AddStruct関数  
  * 引数に`getdata*`と`uint8_t*`をもち、データを格納する構造体変数のポインタ`getdata*`と受信データが入ってる配列のポインタ`uint8_t*`を渡す。  
  * `AddStruct(&data,AIdata);`  
  * 配列の値から構造体の各要素にデータを代入する。  
  * 戻り値はなく、ポーリング方式と割り込みを使用した際のどちらでも使用される関数。  
* StructInit関数  
  * 引数に`getdata*`をもつ。データを格納する構造体変数のポインタ`getdata*`を渡す。  
  * `StructInit(&data);`  
  * 構造体の各要素を初期化する。`LX`,`LY`,`RX`,`RY`スティックは`0x80`に、`L2`,`R2`スティックは`0x00`に、各ボタンは`0`に初期化される。  
  * 戻り値はなく、ポーリング方式と割り込みを使用した際のどちらでも使用される関数。  

