# PWM出力

### LEDの明るさを変更したり、モーターの回転速度を変更したりする
`[プロジェクト名].ioc`-`Pinout & Configuration`-`Timers`-`TIM3`-`Mode`-`Channel3`を`PWM Generation CH3`、`Configuration`-`Parameter Settings`-`Counter Settings`-`Prescaler`を~~`83`~~`4`、`Counter Period`を~~`999`~~`255`、`PWM Generation Channel3`-`Output compare preload`を`Disable`に設定。今回は`TIM3`を使用した。  
保存しコードを作成。`main.c`に処理を追記。  
```c
/* USER CODE BEGIN WHILE */
while (1)
{
    HAL_TIM_PWM_Start(&htim3, TIM_CHANNEL_3);
/* USER CODE END WHILE */

/* USER CODE BEGIN 3 */
    __HAL_TIM_SET_COMPARE(&htim3,TIM_CHANNEL_3,100);
}
/* USER CODE END 3 */
```  
`100`がパルス幅にあたる部分であり、範囲は`0`~`255`にする。  
範囲やPWM周期などは`Prescaler`や`Counter Period`などから求められる。式については[ここ](./tim_Lchika.md)に記載している。`Counter Period`が`範囲の個数-1`であるということだけは覚えていて欲しい。  

#### 参考
* [STM32 HALを使ってPWM出力してみる](https://moons.link/post-632/)