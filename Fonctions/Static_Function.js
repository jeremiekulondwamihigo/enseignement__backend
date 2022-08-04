
module.exports = {
    isEmpty : function(value){
        return(
            value === undefined || value === null ||
            (typeof value === "object" && Object.keys(value).length === 0) ||
            (typeof value === "string" && value.trim().length === 0)
        )
    },
    difference : (a)=>{ 
        const b = new Date().toISOString().split("T")[0]
        const date1 = new Date(a); const date2 = new Date(b);
        const date1utc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
        const date2utc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
            let day = 1000*60*60*24;
            const total = (date2utc - date1utc)/day
        return (parseInt(total))
    },
    differenceMois : (a)=>{ 
        const b = new Date().toISOString().split("T")[0]
        const date1 = new Date(a); const date2 = new Date(b);
        if(date1.getMonth() == date2.getMonth()){
            return true
        }else{
            return false
        }
    },
    
    generateString : (length)=>{
        const caractere = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let resultat = "";
        let caractereLength = caractere.length;
        for(let i=0; i<length;i++){
            resultat+= caractere.charAt(Math.floor(Math.random()* caractereLength));
        }
        return resultat
    },
    generateNumber : (length)=>{
        const caractere = "1234567890";
        let resultat = "";
        let caractereLength = caractere.length;
        for(let i=0; i<length;i++){
            resultat+= caractere.charAt(Math.floor(Math.random()* caractereLength));
        }
        return resultat
    },

    differenceDays : (date1, date2) =>{ 
        const date1utc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
        const date2utc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
            day = 1000*60*60*24;
        return(date2utc - date1utc)/day
    },
}
