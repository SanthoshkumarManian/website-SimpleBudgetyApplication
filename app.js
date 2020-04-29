var budgetcontrol=(function(){
    var expense=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    var income=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    
    var calculateTotal=function(type){
        var sum=0;
        data.allItems[type].forEach(function(cur){
            sum=sum+cur.value; 
        });
        data.totals[type]=sum;
    }
    var data={
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
    }

    return {
        addNewItem:function(type,des,val){
            var Id,newItem;

            if (data.allItems[type].length > 0) {
                Id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                Id = 0;
            }
    
            if (type === 'exp') {
                newItem = new expense(Id, des, val);
            } else if (type === 'inc') {
                newItem = new income(Id, des, val);
            }
            
            data.allItems[type].push(newItem);
            
           
            return newItem;
        },
        calculateBudget:function(){

            calculateTotal('inc');
            calculateTotal('exp');

            data.budget = data.totals.inc -data.totals.exp;

            if(data.totals.inc>0){
                data.percentage = Math.round(( data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage=-1;
            }
           

        },
        getBudget:function(){
            return{
                budget:data.budget,
                totalexp:data.totals.exp,
                totalinc:data.totals.inc,
                percentage:data.percentage    
                }
             },
        testing:function(){
            console.log(data);
        }
    }
})();



var UIcontrol=(function (){
    var DomString={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputbtn:'.add__btn', 
        incomecontainer:'.income__list',
        expensecontainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage'
    }
    return {
        getInput:function(){
            return {
                type:document.querySelector(DomString.inputType).value,
                description:document.querySelector(DomString.inputDescription).value,
                value:parseFloat(document.querySelector(DomString.inputValue).value)
        
            }
        },
        addlistItems:function(obj,type){
                var html,newhtml,element;
                if(type === 'inc' ){
                    element=DomString.incomecontainer;
                    html='<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        
                }else if(type === 'exp' ){
                    element=DomString.expensecontainer;
                    html='<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                 }

                newhtml=html.replace("%id%", obj.id);
                newhtml=newhtml.replace('%description%', obj.description);
                newhtml=newhtml.replace('%value%', obj.value);

                document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);
            }, 
            clearFields:function(){
                var fields;
                
                fields=document.querySelectorAll(DomString.inputDescription+", "+DomString.inputValue);

                fieldsArr=Array.prototype.slice.call(fields);

                fieldsArr.forEach(function(current,index,array){
                    current.value="";
                });
                
                fieldsArr[0].focus();
            },
            displayBudget:function(obj){
                    document.querySelector(DomString.budgetLabel).textContent=obj.budget;
                    document.querySelector(DomString.incomeLabel).textContent=obj.totalinc;
                    document.querySelector(DomString.expenseLabel).textContent=obj.totalexp;
                    if(obj.percentage > 0){
                        document.querySelector(DomString.percentageLabel).textContent=obj.percentage+"%";
                    }

            },
            getDomString:function () {
                return DomString;
            }
             
        };
})();




var controller=(function(bgtctrl,uictr){

    var setupEventListener=function(){
        var DOM=uictr.getDomString;

    document.querySelector('.add__btn').addEventListener('click',addItem);
    
    document.addEventListener('keypress',function(event){
        if(event.keyCode===13 || event.which===13){
            addItem();
        }
    });
    }
    var updateBudget=function(){
        var budget;

        bgtctrl.calculateBudget();

        budget=bgtctrl.getBudget();

        uictr.displayBudget(budget);
    }
    var addItem= function(){
        var input,Items;

        input=uictr.getInput();
        
        if(input.description !='' && !isNaN(input.value) && input.value>0){

            Items=bgtctrl.addNewItem(input.type,input.description,input.value);
           
            uictr.addlistItems(Items,input.type);
    
            uictr.clearFields();
    
            updateBudget();
            }
        }
    return{
        init:function(){
             setupEventListener();
             budget={
             budget:0,
             totalexp:0,
             totalinc:0,
             percentage:-1}
             uictr.displayBudget(budget);
        }
    }
})(budgetcontrol,UIcontrol);



controller.init();