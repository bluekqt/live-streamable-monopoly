const boxes = [];
const addBoxButton = document.getElementById('addBox');
const toggleDragEditButton = document.getElementById('toggleDragEdit');
let isDraggableAndEditable = false;

const modifyBackgroundButton = document.getElementById('modifyBackground');
const modifyAllColorsButton = document.getElementById('modifyAllColors');
const modifyAllTextColorsButton = document.getElementById('modifyAllTextColors');

function createButtons(box) {
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('box-buttons');

    const changeColorButton = document.createElement('div');
    changeColorButton.textContent = '色';
    changeColorButton.className = "changeColorButton";
    changeColorButton.contentEditable = false;

    changeColorButton.addEventListener('click', () => {
        if (document.querySelector('#picker') == null) {
            const pickerElement = document.createElement('div');
            pickerElement.style.position = 'absolute';
            pickerElement.style.left = '-100px';
            pickerElement.style.top = '0px';
            pickerElement.style.zIndex = '999';
            pickerElement.id = "picker";
            box.appendChild(pickerElement);
            // 创建 iro.js 颜色选择器实例
            const colorPicker = new iro.ColorPicker("#picker", {
                width: 100,
                color: pickerElement.parentNode.style.backgroundColor,
                layout: [
                    {
                        component: iro.ui.Wheel,
                    },
                    {
                        component: iro.ui.Slider,
                        options: {
                            sliderType: 'alpha'
                        }
                    },
                ],
            });
            colorPicker.on('color:change', function (color) {
                colorflag = true;
                box.style.backgroundColor = color.rgbaString;
            })
        } else {
            document.querySelector('#picker').remove();
            colorflag = false;
        }
    });

    const deleteButton = document.createElement('div');
    deleteButton.textContent = 'X';
    deleteButton.className = "deleteButton";
    deleteButton.contentEditable = false;
    deleteButton.addEventListener('click', () => {
        removeBox(box);
    });

    buttonsDiv.appendChild(changeColorButton);
    buttonsDiv.appendChild(deleteButton);
    
    box.appendChild(buttonsDiv);
    return buttonsDiv;
}

function showButtons(e) {
    if (!isDraggableAndEditable) return;
    const target = e.target;
    if (target.closest('.draggable-box')) {
        const box = target.closest('.draggable-box');
        box.querySelector('.textDiv').contentEditable = true;
        const buttons = box.querySelector('.box-buttons');
        buttons.style.display = 'block';
    }
}

function hideButtons(e) {
    const target = e.target;
    if (target.closest('.draggable-box')) {
        const box = target.closest('.draggable-box');
        box.querySelector('.textDiv').contentEditable = false;
        const buttons = box.querySelector('.box-buttons');
        buttons.style.display = 'none';
        colorflag = false;
        if (document.querySelector('#picker') != null) {
            document.querySelector('#picker').remove();
        }
    }
}

function removeBox(box) {
    const index = boxes.indexOf(box);
    if (index > -1) {
        boxes.splice(index, 1);
    }
    box.remove();
    updateOrdersAfterDeletion(index);
}

function updateOrdersAfterDeletion(deletedIndex) {
    for (let i = deletedIndex; i < boxes.length; i++) {
        const box = boxes[i];
        box.setAttribute('data-order', i + 1);
        const orderButton = box.querySelector('.orderButton');
        orderButton.textContent = i + 1;
    }
}

function reorderBoxes(newOrder, box) {
    const newIndex = newOrder - 1;
    if (newIndex >= 0 && newIndex < boxes.length) {
        const currentIndex = boxes.indexOf(box);
        if (currentIndex !== newIndex) {
            boxes = [...boxes];
            boxes.splice(currentIndex, 1);
            boxes.splice(newIndex, 0, box);
            updateOrdersAfterDeletion(newIndex);
        }
    }
}

let colorflag = false;
function initDraggable(box) {
    let isDragging = false;
    let offsetX, offsetY;

    box.addEventListener('mousedown', startDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('mousemove', drag);

    function startDrag(e) {
        if (!isDraggableAndEditable) return;
        isDragging = true;
        offsetX = e.clientX - box.offsetLeft;
        offsetY = e.clientY - box.offsetTop;
        document.body.style.userSelect = 'none';
    }

    function stopDrag() {
        isDragging = false;
    }

    function drag(e) {
        if (!isDraggableAndEditable || !isDragging || colorflag) return;
        const container = document.getElementById('container');
        const containerRect = container.getBoundingClientRect();
        const newX = Math.min(Math.max(e.clientX - offsetX, containerRect.left), containerRect.right - box.offsetWidth);
        const newY = Math.min(Math.max(e.clientY - offsetY, containerRect.top), containerRect.bottom - box.offsetHeight);
        box.style.left = `${newX}px`;
        box.style.top = `${newY}px`;
    }
}

// 动态添加盒子
addBoxButton.addEventListener('click', function () {
    const newBox = document.createElement('div');
    newBox.className = 'draggable-box';
    newBox.style.left = '100px';
    newBox.style.top = '100px';
    newBox.style.backgroundColor = allColors;
    newBox.style.color = allTextColors;
    newBox.tabIndex = 0;
    newBox.setAttribute('data-order', boxes.length + 1);
    document.getElementById('container').appendChild(newBox);

    const textDiv = document.createElement('div');
    textDiv.className = 'textDiv';
    textDiv.textContent = '输入内容';
   
    const orderButton = document.createElement('div');
    orderButton.textContent = `${parseInt(newBox.getAttribute('data-order'))}`;
    orderButton.className = "orderButton";
    orderButton.contentEditable = false;

    const buttonsDiv = createButtons(newBox);
    newBox.appendChild(textDiv);
    newBox.appendChild(orderButton);

    newBox.addEventListener('blur', hideButtons);
    textDiv.addEventListener('blur', hideButtons);
    textDiv.addEventListener('click', showButtons);
    initDraggable(newBox);

    boxes.push(newBox);
});

// 切换拖拽和编辑功能
toggleDragEditButton.addEventListener('click', function () {
    isDraggableAndEditable = !isDraggableAndEditable;
    boxes.forEach(box => {
        box.querySelector('.textDiv').contentEditable = isDraggableAndEditable ? 'true' : 'false';
    });
    toggleDragEditButton.querySelector(".button-text").textContent = isDraggableAndEditable ? "编辑棋盘-修改" : "编辑棋盘-展示";
});

// 修改背景图
modifyBackgroundButton.addEventListener('click', function () {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/*';
    inputElement.click();

    inputElement.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const container = document.getElementById('container');
                container.style.backgroundImage = `url(${event.target.result})`;
                container.style.backgroundSize = 'cover';
            };
            reader.readAsDataURL(file);
        }
    });
});

let allColors = 'rgba(255,107,99,1)';
// 修改所有颜色
modifyAllColorsButton.addEventListener('click', function () {
    if (document.querySelector('#pickerAll') == null) {
        // 创建颜色选择器元素
        const pickerElement = document.createElement('div');
        pickerElement.style.position = 'absolute';
        pickerElement.style.left = '-140px';
        pickerElement.style.transform = 'translateX(-50%)';
        pickerElement.style.top = '-180px';
        pickerElement.style.zIndex = '910';
        pickerElement.style.userSelect = 'none';
        pickerElement.id = "pickerAll";
        document.querySelector('#modifyAllColors').appendChild(pickerElement);
        // document.body.appendChild(pickerElement); // 将颜色选择器放在 body 中

        // 创建 iro.js 颜色选择器实例
        const colorPicker = new iro.ColorPicker("#pickerAll", {
            width: 200,
            layout: [
                {
                    component: iro.ui.Wheel,
                },
                {
                    component: iro.ui.Slider,
                    options: {
                        sliderType: 'alpha'
                    }
                },
            ],
        });
        // 更新所有盒子的颜色
        colorPicker.on('color:change', function (color) {
            boxes.forEach(box => {
                box.style.backgroundColor = color.rgbaString;
            });
            allColors = color.rgbaString;
        });
    } else {
        document.querySelector('#pickerAll').remove();
    }
});

let allTextColors = "rgb(255,255,255)";
// 修改所有文本颜色
modifyAllTextColorsButton.addEventListener('click', function () {
    if (document.querySelector('#textColorPicker') == null) {
        // 创建文本颜色选择器元素
        const textColorPickerElement = document.createElement('div');
        textColorPickerElement.style.position = 'absolute';
        textColorPickerElement.style.left = '-140px';
        textColorPickerElement.style.transform = 'translateX(-50%)';
        textColorPickerElement.style.top = '10px'; // 放置在修改所有颜色按钮下方
        textColorPickerElement.style.zIndex = '900';
        textColorPickerElement.style.userSelect = 'none';
        textColorPickerElement.id = "textColorPicker";
        document.querySelector('#modifyAllTextColors').appendChild(textColorPickerElement); 

        // 创建 iro.js 文本颜色选择器实例
        const textColorPicker = new iro.ColorPicker("#textColorPicker", {
            width: 200,
            layout: [
                {
                    component: iro.ui.Wheel,
                },
                {
                    component: iro.ui.Slider,
                    options: {
                        sliderType: 'value'
                    }
                },
            ],
        });

        // 更新所有盒子中的文本颜色
        textColorPicker.on('color:change', function (color) {
            boxes.forEach(box => {
                const textDiv = box.querySelector('.textDiv');
                if (textDiv) {
                    textDiv.style.color = color.hexString; // 使用 hexString 获取更常见的颜色格式
                }
            });
        });
    } else {
        document.querySelector('#textColorPicker').remove();
    }
});

const exportGameButton = document.getElementById('exportGame');

exportGameButton.addEventListener('click', function () {
  const data = {
    gridData: [],
    backgroundImage: document.getElementById('container').style.backgroundImage.replace(/url\(["']?|["']?\)$/g, ''),
  };

  // 收集每个格子的数据
  boxes.forEach(box => {
    const boxPosition = [parseInt(box.style.left), parseInt(box.style.top)];
    const textContent = box.querySelector('.textDiv').textContent.trim(); // 获取文字内容
    const boxColor = box.style.backgroundColor;
    data.gridData.push({ position: boxPosition, color: boxColor, text: textContent }); // 添加文字内容到数据对象中
  });

  // 将数据转换为 JSON 字符串
  const jsonData = JSON.stringify(data);

  // 创建一个 Blob 对象来存储 JSON 数据
  const blob = new Blob([jsonData], { type: 'application/json' });

  // 创建一个临时的下载链接
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'game-data.json';
  document.body.appendChild(link); // 需要先添加到 DOM 中才能触发点击事件
  link.click(); // 模拟点击下载
  document.body.removeChild(link); // 下载完成后移除元素
  window.URL.revokeObjectURL(url); // 释放 URL 对象
});

const importGameButton = document.getElementById('importGame');

importGameButton.addEventListener('click', function () {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
      const contents = e.target.result;
      try {
        const data = JSON.parse(contents);
        // 更新游戏中的数据
        updateGameData(data.gridData, data.backgroundImage);
      } catch (error) {
        console.error('无法解析 JSON 文件:', error);
      }
    };

    reader.readAsText(file);
  };

  input.click();
});

function updateGameData(gridData, backgroundImage) {
  // 清空现有的格子
  document.getElementById('container').innerHTML = '';
  
  boxes.length = 0;

  // 设置新的背景图片
  document.getElementById('container').style.backgroundImage = `url(${backgroundImage})`;
  document.getElementById('container').style.backgroundSize = 'cover';
  // 重新创建格子
  gridData.forEach(data => {
    const newBox = document.createElement('div');
    newBox.className = 'draggable-box';
    newBox.style.left = `${data.position[0]}px`;
    newBox.style.top = `${data.position[1]}px`;
    newBox.style.backgroundColor = data.color;
    newBox.tabIndex = 0;
    newBox.setAttribute('data-order', boxes.length + 1);
    document.getElementById('container').appendChild(newBox);

    const textDiv = document.createElement('div');
    textDiv.className = 'textDiv';
    textDiv.textContent = data.text || '输入内容';

    const orderButton = document.createElement('div');
    orderButton.textContent = `${parseInt(newBox.getAttribute('data-order'))}`;
    orderButton.className = "orderButton";
    orderButton.contentEditable = false;

    const buttonsDiv = createButtons(newBox);
    newBox.appendChild(textDiv);
    newBox.appendChild(orderButton);

    newBox.addEventListener('blur', hideButtons);
    textDiv.addEventListener('blur', hideButtons);
    textDiv.addEventListener('click', showButtons);
    initDraggable(newBox);
    
    boxes.push(newBox);
  });
}

