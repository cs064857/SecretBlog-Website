export function cleanStringAndDateValue(Obj:Object){
    Object.keys(Obj).forEach(key => {
        if (typeof Obj[key] === 'string') {
            Obj[key] = '';
        }else if(Obj[key] instanceof Date ){
            Obj[key] = new Date('');
        }
    });
}
