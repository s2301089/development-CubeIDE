# TeraTermにprintf出力(lib)

[TeraTermにprintf出力](./chapter_2.md)で`printf`する方法を紹介したがいちいち`int _write`とか書くのがめんどくさくなったので処理をまとめた。  

`[プロジェクト名].ioc`-`Pinout & Configuration`-`Connectivity`-`USART2`-`Mode`を`Asynchronous`、`Configuration`-`Parameter Settings`-`Basic Parameters`-`Baud Rate`を`38400`に設定。今回は`USART2`を使用した。  
保存しコードを作成。`main.c`に処理を追記。  
```c
/* USER CODE BEGIN Includes */
#include <stdio.h>
#include "STprintf.h"
/* USER CODE END Includes */

/* USER CODE BEGIN 2 */
STprintf(&huart2);
uint8_t Out[8] = {0};
/* USER CODE END 2 */

/* USER CODE BEGIN 3 */
    printf("Hello World\r\n");
    HAL_Delay(250);
}
/* USER CODE END 3 */

```  
`STprintf`関数の引数にUARTのポインタを渡すだけで`printf`が使えるようになる。  

### TeraTermの設定  
`TeraTerm`を開いて`ファイル`-`新しい接続`-`シリアル`-`COM◯: STMicroelectronics STLink Virtual COM Port (COM◯)`-`OK`でマイコンと接続する。`設定`-`シリアルポート`-`スピード`を`CubeIDE`側で設定した`Baud Rate`を入力。ここでは`38400`と設定。`現在の接続を再設定`で設定を完了させる。  

#### 参考
* [TeraTermでprintf出力](./chapter_2.md)  