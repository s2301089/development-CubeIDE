# ディジタル入出力

### LEDを点灯させたり、プッシュスイッチの値を読み込んだりする
`[プロジェクト名].ioc`-`Pinout & Configuration`-`Pinout view`から使いたいピンを選択する。今回は`PA_1`を`GPIO_Input`、`PA_0`を`GPIO_Output`に設定した。ピンを選ぶときには使用するマイコンボードのMbedのページ(ここでは[NUCLEO-F446RE](https://os.mbed.com/platforms/ST-Nucleo-F446RE/))の`Morpho headers`を見ながら選ぶといいかもしれない。  
保存しコードを作成。`main.c`に処理を追記。  
```c
/* USER CODE BEGIN 2 */
int psw1;
/* USER CODE END 2 */

/* USER CODE BEGIN 3 */
    psw1 = HAL_GPIO_ReadPin(GPIOA, GPIO_PIN_1); // ディジタル入力
    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_0, psw1); // ディジタル出力
}
/* USER CODE END 3 */
```  
使用する回路によって動作は異なるがプルアップ抵抗を用いたプッシュスイッチの回路であれば、スイッチを押すとLEDは消灯し、離すとLEDは点灯するだろう。  

#### 参考  
* [STM32CubeIDEを使ってみよう　How To STM32CubeIDE 日本語版　(4) スイッチを使ってみよう](https://qiita.com/usashirou/items/30e522589db9f7dc8fe4)