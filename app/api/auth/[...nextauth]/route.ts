import { handlers } from '@/lib/auth';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest, ctx: any) => {
  return handlers.GET(req, ctx);
};

export const POST = async (req: NextRequest, ctx: any) => {
  return handlers.POST(req, ctx);
};
