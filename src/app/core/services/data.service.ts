import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class DataService {
  private supabase: SupabaseClient;

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.client;
  }

  async getAll<T>(
    table: string,
    options?: {
      select?: string;
      filters?: Record<string, any>;
      orderBy?: { column: string; ascending?: boolean };
      limit?: number;
    }
  ): Promise<{ data: T[] | null; error: string | null }> {
    let query = this.supabase
      .from(table)
      .select(options?.select || '*');

    if (options?.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        query = query.eq(key, value);
      }
    }
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true
      });
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    return { data: data as T[] | null, error: error?.message || null };
  }

  async getById<T>(
    table: string,
    id: number,
    pkColumn: string = 'id',
    select: string = '*'
  ): Promise<{ data: T | null; error: string | null }> {
    const { data, error } = await this.supabase
      .from(table)
      .select(select)
      .eq(pkColumn, id)
      .single();
    return { data: data as T | null, error: error?.message || null };
  }

  async create<T>(
    table: string,
    record: Record<string, any>
  ): Promise<{ data: T | null; error: string | null }> {
    const { data, error } = await this.supabase
      .from(table)
      .insert(record)
      .select()
      .single();
    return { data: data as T | null, error: error?.message || null };
  }

  async update<T>(
    table: string,
    id: number,
    changes: Record<string, any>,
    pkColumn: string = 'id'
  ): Promise<{ data: T | null; error: string | null }> {
    const { data, error } = await this.supabase
      .from(table)
      .update(changes)
      .eq(pkColumn, id)
      .select()
      .single();
    return { data: data as T | null, error: error?.message || null };
  }

  async softDelete(
    table: string,
    id: number,
    pkColumn: string = 'id'
  ): Promise<{ error: string | null }> {
    const { error } = await this.supabase
      .from(table)
      .update({ is_active: false } as any)
      .eq(pkColumn, id);
    return { error: error?.message || null };
  }

  async rpc<T>(
    functionName: string,
    params: Record<string, any>
  ): Promise<{ data: T | null; error: string | null }> {
    const { data, error } = await this.supabase.rpc(functionName, params);
    return { data: data as T | null, error: error?.message || null };
  }
}
