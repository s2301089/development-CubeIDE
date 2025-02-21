# UART通信(受信)

### ArduinoなどからのデータをUARTを使用して受け取る
`[プロジェクト名].ioc`-`Pinout & Configuration`-`Connectivity`-`USART1`-`Mode`を`Asynchronous`、`Configuration`-`Parameter Settings`-`Basic Parameters`-`Baud Rate`を`38400`に設定。今回は`USART1`を使用した。  
保存しコードを作成。`main.c`に処理を追記。  
```c
/* USER CODE BEGIN 2 */
char getdata;
/* USER CODE END 2 */

/* Infinite loop */
/* USER CODE BEGIN WHILE */
while (1)
{
/* USER CODE END WHILE */

/* USER CODE BEGIN 3 */
    if(HAL_UART_Receive(&huart1, &getdata, 1, 10) == HAL_OK){
        printf("%x\r\n",getdata);
    }
}
/* USER CODE END 3 */
```  
受け取ったデータを`printf`する。たとえば`Arduino`側でスイッチの値を送るとしたら`TeraTerm`の画面にはそのスイッチの値が表示されるだろう。  

#### 参考
* [STM32CubeIDEを使ってみよう　How To STM32CubeIDE 日本語版　(6) 　UARTを使ってみよう(2)](https://qiita.com/usashirou/items/5a2c9e4fd35c261c4f3a)