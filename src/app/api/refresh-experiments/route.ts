// src/app/api/refresh-experiments/route.ts
import { NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function POST() {
  return new Promise((resolve) => {
    exec('node scripts/generate-experiments.js', (error, stdout, stderr) => {
      if (error) {
        resolve(NextResponse.json({ success: false, error: stderr || error.message }));
      } else {
        resolve(NextResponse.json({ success: true, output: stdout }));
      }
    });
  });
}
