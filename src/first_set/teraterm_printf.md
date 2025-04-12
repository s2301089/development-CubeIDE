# TeraTermにprintf出力

### printfを使って変数の値などを見れるようにする
マイコンとPCとの間でUARTを用いて通信を行う。  
### CubeIDEの設定  
`[プロジェクト名].ioc`-`Pinout & Configuration`-`Connectivity`-`USART2`-`Mode`を`Asynchronous`、`Configuration`-`Parameter Settings`-`Basic Parameters`-`Baud Rate`を`38400`に設定。今回は`USART2`を使用した。  
保存しコードを作成。`main.c`に処理を追記。  
```c
/* USER CODE BEGIN Includes */
#include <stdio.h>
/* USER CODE END Includes */

/* USER CODE BEGIN 1 */
setbuf(stdout,NULL);
/* USER CODE END 1 */

/* USER CODE BEGIN 3 */
    printf("Hello World\r\n");
    HAL_Delay(250);
}
/* USER CODE END 3 */

/* USER CODE BEGIN 4 */
int _write(int file,char *ptr,int len){
	HAL_UART_Transmit(&huart2, (uint8_t *)ptr, len, 10);
	return len;
}
/* USER CODE END 4 */
```  
### TeraTermの設定  
`TeraTerm`を開いて`ファイル`-`新しい接続`-`シリアル`-`COM◯: STMicroelectronics STLink Virtual COM Port (COM◯)`-`OK`でマイコンと接続する。`設定`-`シリアルポート`-`スピード`を`CubeIDE`側で設定した`Baud Rate`を入力。ここでは`38400`と設定。`現在の接続を再設定`で設定を完了させる。


#### 参考
* [【便利】STM32CubeIDEでprintf【UART編】](https://yukblog.net/stm32cubeide-printf-uart/)