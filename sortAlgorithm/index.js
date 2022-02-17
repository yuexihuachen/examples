window.addEventListener('DOMContentLoaded', (event) => {
  /**
     * 冒泡排序-基本排序
     * 从第一个数开始两两比较，大的方右边，最大的在最后一位
     * 每次减少拍好顺序的数
     * 时间复杂度 n^2
     */

  function bubbleSort(arr) {
    let len = arr.length
    for (let i = 0; i < len - 1; i++) {
      for (let j = 0; j < len - 1 - i; j++) {
        if (arr[j] > arr[j + 1]) {
          let temp = arr[j + 1]
          arr[j + 1] = arr[j]
          arr[j] = temp
        }
      }
    }
    return arr
  }

  //console.log(bubbleSort([8, 2, 3, 15, 25, 5, 1, 6, 4, 7]))

  /**
     * 选择排序-基本排序
     * 默认第一个为最小的数，和剩下的每个数比较，小于当前值覆盖下标，
     * 最后找到的最小值和第一个值护环，最小的值永远在前面
     * 时间复杂度 n^2
     */
  function selectionSort(arr) {
    let len = arr.length
    let minIndex, temp
    for (let i = 0; i < len - 1; i++) {
      minIndex = i;
      for (let j = i + 1; j < len; j++) {
        if (arr[j] < arr[minIndex]) {
          minIndex = j
        }
      }
      temp = arr[i]
      arr[i] = arr[minIndex]
      arr[minIndex] = temp
    }
    return arr
  }

  //console.log(selectionSort([8, 2, 3, 15, 25, 5, 1, 6, 4, 7]))

  /**
     * 插入排序-基本排序
     * 
     * 
     * 时间复杂度 n^2
     */










});