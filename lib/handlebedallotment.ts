import { supabase } from "@/providers/db";

const handlebedallotment = async (appointmentId: string, location: string) => {
    const todaydateandtime = new Date().toISOString();
    const beds_in_selected_ward = await supabase.from('beds').select('*').eq('location_id', location);
    console.log(beds_in_selected_ward, "beds_in_selected_ward");


   /* const { data, error } = await supabase.from('appointments').update({
        bed_allotment: true,
        bed_allotment_date: todaydateandtime
    }).eq('id', appointmentId);*/
    
}

export default handlebedallotment;
