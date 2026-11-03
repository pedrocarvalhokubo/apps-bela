import {getDevice,ACCOUNT_PROFILE_ID} from '../app/api/_lib';
export async function getTutorDevice(request:Request){
 const device=await getDevice(request);
 return device?.profileId===ACCOUNT_PROFILE_ID?device:null;
}
