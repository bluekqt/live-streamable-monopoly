const addDice = document.getElementById('showdice');

// 盒子移动
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
addDice.addEventListener('click', function () {
    const area = document.getElementById('area');
    if (area==null) {
        const areadiv = document.createElement('div');
        areadiv.id = 'area';
        areadiv.style.display = 'block';
        const myDice = dice(areadiv,{
            // edgeLength:100
            radius:5,
            // hasShadow:false,
            // shadowTop:90,
            keepAnimationTime:1500,
            onKeepAnimationEnd:function(result){
                // console.log('onKeepAnimationEnd,result:'+result+',time:'+(new Date).getTime())
            }
            ,onEndAnimationEnd:function(result){
                console.log('onEndAnimationEnd,result:'+result+',time:'+(new Date).getTime())
            }
        })
        areadiv.addEventListener('dblclick', function () {
            myDice.roll("1,2,3,4,5,6")
        })
        initDraggableRole(areadiv);
        document.querySelector('#container').appendChild(areadiv);
    }
        area.style.display = area.style.display == 'block' ? 'none' : 'block';
});

