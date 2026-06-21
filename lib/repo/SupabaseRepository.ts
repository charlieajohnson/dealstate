import {createClient} from "@supabase/supabase-js";
import type {OpportunityBundle,OpportunityRepository} from "./OpportunityRepository";

export class SupabaseRepository implements OpportunityRepository {
  private client=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
  async list(){const{data,error}=await this.client.from("opportunities").select("*").order("last_updated_at",{ascending:false});if(error)throw error;return data}
  async getBySlug(slug:string):Promise<OpportunityBundle|null>{void slug;throw new Error("TODO(init): hydrate the full Supabase opportunity aggregate after pass-1 database seeding.")}
}
