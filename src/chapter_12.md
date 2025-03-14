# タイマー割り込みによるLチカ  

### HAL_Delay()を使わないでLチカをする  
今までLチカは以下のようなコードでしていた。  
```c
HAL_GPIO_TogglePin(GPIOA,GPIO_PIN_0);
HAL_Delay(1000);
```  
これは毎秒Lチカするプログラムである。このコードでは次にLEDの状態を変えるまで処理をすべて止めている。そのため、他の処理をしようとしてもできなかった。そんなときにタイマー割り込みを使用すれば他の処理を止めることなく、一定の周期である処理を実行することができる。  
`[プロジェクト名].ioc`-`Pinout & Configuration`-`Timers`-`TIM2`-`Mode`-`Clock Source`を`Internal Clock`、`Configuration`-`Parameter Settings`-`Counter Settings`-`Prescaler`を`15`、`Counter Period`を`999999`に、`Configuration`-`NVIC Setting`-`TIM2 global interrupt`を`Enable`に設定。今回は`TIM2`を使用した。  
`main.c`  
```c
/* USER CODE BEGIN 2 */
HAL_TIM_Base_Start_IT(&htim2);
/* USER CODE END 2 */

/* USER CODE BEGIN 4 */
void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef* htim){
	HAL_GPIO_TogglePin(GPIOxA, GPIO_Pin_0);
}
/* USER CODE END 4 */
```  
`HAL_TIM_PeriodElapsedCallback`関数は割り込みをした時に実行される関数であるため、そこにLチカのコードを書く。  
割り込み周期は設定した`Prescaler`と`Counter Period`、内部クロック周波数で決まる。内部クロック周波数はデフォルトでは`16MHz`だが変更したいまたは。確認したい場合は`ioc`ファイルの`Clock Configuration`-`APB1 Timer clocks(MHz)`で確認する(たぶん)。割り込み周期は以下の式で求められる。  
$$f = \frac{内部クロック周波数}{(Prescaler + 1)(Counter Period + 1)}$$  
また、周期は周波数の逆数なので周期から求めると、  
$$ T = \frac{1}{f} = \frac{(Prescaler + 1)(Counter Period + 1)}{内部クロック周波数} $$  
となる。おすすめとしては`Prescaler`を`15`として`Counter Period`の値を変更するとわかりやすいかもしれない。  
上記の例では`Prescaler`が`15`で`Counter Period`が`999999`なので周期は、  
$$ \frac{(15 + 1)(999999 + 1)}{16 \times 10^6} = 1[s] $$  
となり、毎秒Lチカするプログラムになっている。  

#### 参考  
* [STM32CubeIDEを使ってみよう How To STM32CubeIDE 日本語版 (15) TimerでLチカしよう](https://qiita.com/usashirou/items/e02b798b4bf1b92a4546)