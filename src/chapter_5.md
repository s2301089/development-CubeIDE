# アナログ入力

### 可変抵抗の値を読み取ったり、センサの値を読み取ったりする
`[プロジェクト名].ioc`-`Pinout & Configuration`-`Pinout view`から使いたいピンを選択する。今回は`PA_4`を`ADC1_IN4`に設定した。ピンを選ぶときには使用するマイコンボードのMbedのページ(ここでは[NUCLEO-F446RE](https://os.mbed.com/platforms/ST-Nucleo-F446RE/))の`Morpho headers`を見ながら選ぶといいかもしれない。  
保存しコードを作成。`main.c`に処理を追記。  
```c
/* USER CODE BEGIN 2 */
float resi1;
/* USER CODE END 2 */

/* USER CODE BEGIN WHILE */
while (1)
{
    HAL_ADC_Start(&hadc1);
/* USER CODE END WHILE */

/* USER CODE BEGIN 3 */
    HAL_ADC_PollForConversion(&hadc1, 100);
    resi1 = HAL_ADC_GetValue(&hadc1);
    printf("%f\r\n",resi1);
    HAL_Delay(250);
}
/* USER CODE END 3 */
```  
`float`型を`printf`するために、設定を変更する。`[プロジェクト名]`を右クリック、`プロパティ`-`C/C++ ビルド`-`設定`-`ツール設定`-`MCU/MPU Settings`の`Use float with printf from newlib-nano`の項目にチェックを入れ、適用して閉じる。  
今回は可変抵抗を用いてアナログ入力値の変化を出力した。`printf`を使えるようにするためには、他の設定やコードが必要。[これ](./chapter_2.md)を参考にした。  

#### 参考
* [STM32CubeIDEを使ってみよう How To STM32CubeIDE 日本語版 (12) ADCを使ってみよう](https://qiita.com/usashirou/items/e6b5d0529524a140ebaf)
* [STM32CubeIDEのprintfでfloatが使えない件の対処方法](https://yukblog.net/stm32cubeide-printf-float/)