import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

// This helper function is now more generic
async function runPythonScript(args: string[]): Promise<void> {
  const pythonScriptPath = path.join(process.cwd(), 'src/app/api/watermark/watermarking.py');

  return new Promise((resolve, reject) => {
    const pythonExecutable = process.platform === "win32" ? "python" : "python3";
    const python = spawn(pythonExecutable, [pythonScriptPath, ...args]);
    
    let errorData = '';
    python.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}: ${errorData}`);
        reject(new Error(`Python script error: ${errorData}`));
      } else {
        resolve();
      }
    });
  });
}

// --- Main handler that routes to different actions ---
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const action = formData.get('action') as 'embed' | 'extract';

  if (action === 'embed') {
    return handleEmbed(formData);
  } else if (action === 'extract') {
    return handleExtract(formData);
  } else {
    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  }
}

// --- Embed Logic (mostly unchanged) ---
async function handleEmbed(formData: FormData) {
  const hostFile = formData.get('hostImage') as File;
  const wmFile = formData.get('watermarkImage') as File;
  const key = formData.get('key') as string;
  const channels = formData.get('channels') as string;
  
  if (!hostFile || !wmFile || !key) {
    return NextResponse.json({ error: 'Missing required fields for embedding' }, { status: 400 });
  }

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'watermark-embed-'));
  
  try {
    const hostPath = path.join(tempDir, hostFile.name);
    const wmPath = path.join(tempDir, wmFile.name);
    const outPath = path.join(tempDir, 'stego.png');

    await fs.writeFile(hostPath, Buffer.from(await hostFile.arrayBuffer()));
    await fs.writeFile(wmPath, Buffer.from(await wmFile.arrayBuffer()));
    
    const args = ['embed', '--host', hostPath, '--wm', wmPath, '--out', outPath, '--key', key, '--channels', channels || 'BGR'];
    await runPythonScript(args);
    
    const stegoImageBuffer = await fs.readFile(outPath);
    const base64Image = stegoImageBuffer.toString('base64');
    
    return NextResponse.json({ stegoImage: `data:image/png;base64,${base64Image}` });
  } catch (error: any) {
    console.error('Embed API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

// --- NEW: Extraction Logic ---
async function handleExtract(formData: FormData) {
  const stegoFile = formData.get('stegoImage') as File;
  const key = formData.get('key') as string;
  const channels = formData.get('channels') as string;

  if (!stegoFile || !key) {
    return NextResponse.json({ error: 'Missing required fields for extraction' }, { status: 400 });
  }

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'watermark-extract-'));

  try {
    const stegoPath = path.join(tempDir, stegoFile.name);
    const outPath = path.join(tempDir, 'extracted.png');

    await fs.writeFile(stegoPath, Buffer.from(await stegoFile.arrayBuffer()));

    const args = ['extract', '--stego', stegoPath, '--out', outPath, '--key', key, '--channels', channels || 'BGR']; 
    await runPythonScript(args);
    
    const extractedImageBuffer = await fs.readFile(outPath);
    const base64Image = extractedImageBuffer.toString('base64');

    return NextResponse.json({ extractedImage: `data:image/png;base64,${base64Image}` });
  } catch (error: any) {
    console.error('Extract API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}