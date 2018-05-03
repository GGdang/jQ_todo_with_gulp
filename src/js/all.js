$(function () {
    // 讀取 localStorage 資料
    // itemList = JSON.parse(localStorage.getItem('itemList'));

    //寫入 localStorage 資料  PS:必須是字串型態
    // localStorage.setItem('itemList', JSON.stringify(itemList));

    // 刪除 localStorage 資料
    // localStorage.removeItem('test');

    // 刪除 全部資料
    // localStorage.clear();

    let Userlist = [{
        userName: '',
        listEnvet: []
    }];

    let doneList = function(Userlist,num){
        let userName = Userlist[0].userName;
        Userlist[0].listEnvet[num].status = 'done';
        console.log(Userlist[0].listEnvet[num].status);
        localStorage.setItem(`${userName}List`, JSON.stringify(Userlist));
    }

    let DelList = function(Userlist,num){
        let userName = Userlist[0].userName;
        Userlist[0].listEnvet.splice(num,1);
        localStorage.setItem(`${userName}List`, JSON.stringify(Userlist));
    }
    let AddList = function (Userlist, textVal) {
        let userName = Userlist[0].userName;
        let tempVal = {
            event : `${textVal}`,
            status : `undone`
        }
        Userlist[0].listEnvet.push(tempVal);
        localStorage.setItem(`${userName}List`, JSON.stringify(Userlist));

        let listNum = Userlist[0].listEnvet.length;
        let val = `<h5 class="mb-0 pb-2">${Userlist[0].listEnvet[listNum-1].event}</h5>`;
        let delBtn = `<button class=" btn delBtn btn-danger" data-btn="DelBtn">刪除事項</button>`;
        let secBtn = `<button class="secBtn btn btn-primary" data-btn="secBtn">已完成</button>`;
        let btngroup = `<div class=" pt-2 btngroup d-flex justify-content-between">${secBtn}${delBtn}</div>`
        let listItem = `<li data-num="${listNum-1}" class="m-2 hao-animateIn">${val}${btngroup}</li>`;
        $(`.listItems`).append(listItem);
    }

    let showList = function (Userlist) {
        let listNum = Userlist[0].listEnvet.length;
        for (let i = 0; i < listNum; i++) {
            if(Userlist[0].listEnvet[i].status != 'done'){
                let val = `<h5 class="mb-0 pb-2">${Userlist[0].listEnvet[i].event}</h5>`;
                let delBtn = `<button class=" btn delBtn btn-danger" data-btn="DelBtn">刪除事項</button>`;
                let secBtn = `<button class="secBtn btn btn-primary" data-btn="secBtn">已完成</button>`;
                let btngroup = `<div class=" pt-2 btngroup d-flex justify-content-between">${secBtn}${delBtn}</div>`
                let listItem = `<li data-num="${i}" class="m-2 hao-animateIn">${val}${btngroup}</li>`;
                $(`.listItems`).append(listItem);
            }else{
                let val = `<h5 class="mb-0 pb-2">${Userlist[0].listEnvet[i].event}</h5>`;
                let delBtn = `<button class=" btn delBtn btn-danger" data-btn="DelBtn">刪除事項</button>`;
                let secBtn = `<button class="secBtn btn btn-primary" data-btn="secBtn">已完成</button>`;
                let btngroup = `<div class=" pt-2 btngroup d-flex justify-content-between">${secBtn}${delBtn}</div>`
                let listItem = `<li style="background-image:url('./images/checklistDone_bg.png')" data-num="${i}" class="m-2 hao-animateIn">${val}${btngroup}</li>`;
                $(`.listItems`).append(listItem);
            }
        }
    }

    $('#submit').on('click', function (e) {
        let val = $(`#listInput`).val();
        if (val !== '') {
            AddList(Userlist, val);
            $(`#listInput`).val('');
        } else {
            $('#inputVal').modal('show');
        }
    })
    //刪除 List 
    $(document).on('click', '.listItems li .delBtn', function () {
        var self = $(this).parent().parent();
        console.log(self.data('num'));
        let num = self.data('num');
        DelList(Userlist,num);
        self.removeClass('hao-animateIn');
        self.addClass('hao-animateOut');
        
        setTimeout(function () {
            self.remove();
        }, 800);
    });
    //完成 List
    $(document).on('click', '.listItems li .secBtn', function (e) {
        var self = $(this).parent().parent();
        console.log(self.data('num'));
        let num = self.data('num');
        doneList(Userlist,num);
        self.css("background-image", 'url("./images/checklistDone_bg.png")')
    });

    //清除所有資料
    $('#userDelBtn').on('click',function(e){
        localStorage.clear();
    })

    $('#nowUserDel').on('click',function(e){
        let userName = Userlist[0].userName;
        Userlist[0].listEnvet.length=0;
        localStorage.setItem(`${userName}List`, JSON.stringify(Userlist));

        $('.listItems').children('li').removeClass('hao-animateIn');
        $('.listItems').children('li').addClass('hao-animateOut');
        setTimeout(function () {
            $('.listItems').children('li').remove();
        }, 800);
    })

    //切換使用者
    $('#changeUser').on('click',function(e){
        $('.enName').slideDown(800);
    })

    $('#userBtn').on('click', (e) => {
        let userName = $('#userName').val();
        $('#userName').val('');
        if (userName !== '') {
            Userlist = JSON.parse(localStorage.getItem(`${userName}List`));
            if (Userlist === null) {
                console.log(Userlist === null);
                Userlist = [{
                    userName: '',
                    listEnvet: []
                }];
                Userlist[0].userName = userName;
                localStorage.setItem(`${userName}List`, JSON.stringify(Userlist));
                $('#todoTitle').html(`${userName}的待辦事項`);
                $('.enName').slideUp(800);
            } else {
                showList(Userlist);
                $('#todoTitle').html(`${userName}的待辦事項`);
                $('.enName').slideUp(800);
            }
        } else {
            $('#UserVal').modal('show');
        }
    })
})