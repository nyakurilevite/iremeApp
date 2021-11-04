
const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58
let uuid=uidgen.generateSync(); 
const { v4: uuidv4 } = require('uuid');
const token=uuidv4();
// current timestamp in milliseconds
let ts = Date.now();
let date_ob = new Date(ts);
let sec = date_ob.getSeconds();
let min = date_ob.getMinutes();
let hr = date_ob.getHours();
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();
let now=year + "-" + month + "-" + date+" "+hr+":"+min+":"+sec;


module.exports = {
    now: now,
    account_id:uuid,
    token:token
}