let roleBoxes = [];
const addRoleBoxButton = document.getElementById('modifyRoles'); // 新增的按钮
// 添加角色盒子
function initDraggableRole(box) {
    let isDragging = false;
    let offsetX, offsetY;

    box.addEventListener('mousedown', startDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('mousemove', drag);

    function startDrag(e) {
        isDragging = true;
        offsetX = e.clientX - box.offsetLeft;
        offsetY = e.clientY - box.offsetTop;
        document.body.style.userSelect = 'none';
    }

    function stopDrag() {
        isDragging = false;
    }

    function drag(e) {
        if (!isDragging) return;
        const container = document.getElementById('container');
        const containerRect = container.getBoundingClientRect();
        const newX = Math.min(Math.max(e.clientX - offsetX, containerRect.left), containerRect.right - box.offsetWidth);
        const newY = Math.min(Math.max(e.clientY - offsetY, containerRect.top), containerRect.bottom - box.offsetHeight);
        box.style.left = `${newX}px`;
        box.style.top = `${newY}px`;
    }
}

// 动态添加角色盒子
addRoleBoxButton.addEventListener('click', function () {
    const roleBox = document.createElement('div');
    roleBox.className = 'role-box';
    roleBox.style.right = '40px';
    roleBox.style.top = '500px';
    roleBox.style.backgroundImage = 'url(./img/roleImage/avatar.jpg)';
    roleBox.style.backgroundSize = 'cover';
    roleBox.style.zIndex = 666;
    roleBox.tabIndex = 0;
    roleBox.setAttribute('data-order', roleBoxes.length + 1);
    document.getElementById('container').appendChild(roleBox);

    const roletext = document.createElement('div');
    roletext.className = 'roletext';
    roletext.textContent = '名字';
    roleBox.appendChild(roletext);

    const buttonsDiv = createRoleButtons(roleBox);
    roletext.addEventListener('blur', hideButtonsRole);
    // roleBox.addEventListener('blur', hideButtonsRole);
    roleBox.addEventListener('dblclick', showButtonsRole);
    initDraggableRole(roleBox);

    roleBoxes = [...roleBoxes, roleBox];
});

// 创建角色盒子上的按钮
function createRoleButtons(roleBox) {
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('box-buttons');

    const changeImageButton = document.createElement('div');
    changeImageButton.textContent = '图';
    changeImageButton.className = "changeImageButton";
    changeImageButton.contentEditable = false;
    changeImageButton.addEventListener('click', () => {
        changeRoleImage(roleBox);
    });

    const deleteRoleButton = document.createElement('div');
    deleteRoleButton.textContent = 'X';
    deleteRoleButton.className = "deleteButtonRole";
    deleteRoleButton.contentEditable = false;
    deleteRoleButton.addEventListener('click', () => {
        removeBoxRole(roleBox);
    });

    buttonsDiv.appendChild(changeImageButton);
    buttonsDiv.appendChild(deleteRoleButton);
    roleBox.appendChild(buttonsDiv);
    return buttonsDiv;
}

// 更改角色图片的函数
function changeRoleImage(roleBox) {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/*';
    inputElement.click();

    inputElement.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                roleBox.style.backgroundImage = `url(${event.target.result})`;
                roleBox.style.backgroundSize = 'cover';
            };
            reader.readAsDataURL(file);
        }
    });
}

function showButtonsRole(e) {
    const target = e.target;
    if (target.closest('.role-box')) {
        const box = target.closest('.role-box');
        box.querySelector('.roletext').contentEditable = true;
        const buttons = box.querySelector('.box-buttons');
        buttons.style.display = 'block';
    }
}

function hideButtonsRole(e) {
    const target = e.target;
    if (target.closest('.role-box')) {
        const box = target.closest('.role-box');
        box.querySelector('.roletext').contentEditable = false;
        const buttons = box.querySelector('.box-buttons');
        buttons.style.display = 'none';
    }
}

function removeBoxRole(box) {
    const index = roleBoxes.indexOf(box);
    if (index > -1) {
        roleBoxes.splice(index, 1);
    }
    box.remove();
    updateOrdersAfterDeletionRole(index);
}

function updateOrdersAfterDeletionRole(deletedIndex) {
    for (let i = deletedIndex; i < roleBoxes.length; i++) {
        const box = roleBoxes[i];
        box.setAttribute('data-order', i + 1);
        const orderButton = box.querySelector('.box-buttons div:last-child');
    }
}