import {getDevice,unauthorized} from '../_lib';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 if(!await getDevice(request))return unauthorized();
 const date=process.env.BELA_GEOGRAPHY_ASSESSMENT_DATE;
 return Response.json({geography:date&&/^\d{4}-\d{2}-\d{2}$/.test(date)?{date,term:3}:null},{headers:{'Cache-Control':'private, no-store'}});
}
