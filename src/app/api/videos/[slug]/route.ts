import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const rawSlug = params.slug.replace(/\.mp4$/, '');
    const filename = `${rawSlug}.mp4`;
    
    // Check multiple possible paths
    const publicPath = path.join(process.cwd(), 'public', 'videos', 'exercises', filename);
    const kaggleCachePath = path.join(
      process.env.HOME || '/Users/arifkhadim',
      '.cache',
      'kagglehub',
      'datasets',
      'hasyimabdillah',
      'workoutfitness-video',
      'versions',
      '5'
    );

    let filePath = '';
    if (fs.existsSync(publicPath)) {
      filePath = publicPath;
    } else {
      // Look in kaggle cache directory
      const cleanName = rawSlug.replace(/-/g, ' ');
      if (fs.existsSync(kaggleCachePath)) {
        const folders = fs.readdirSync(kaggleCachePath);
        for (const folder of folders) {
          if (folder.toLowerCase().includes(cleanName) || cleanName.includes(folder.toLowerCase())) {
            const folderDir = path.join(kaggleCachePath, folder);
            if (fs.statSync(folderDir).isDirectory()) {
              const files = fs.readdirSync(folderDir).filter(f => f.toLowerCase().endsWith('.mp4'));
              if (files.length > 0) {
                filePath = path.join(folderDir, files[0]);
                break;
              }
            }
          }
        }
      }
    }

    if (!filePath || !fs.existsSync(filePath)) {
      // Fallback to bench press
      const fallbackPath = path.join(process.cwd(), 'public', 'videos', 'exercises', 'bench-press.mp4');
      if (fs.existsSync(fallbackPath)) {
        filePath = fallbackPath;
      } else {
        return new NextResponse('Video not found', { status: 404 });
      }
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.get('range');

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;

      const file = fs.createReadStream(filePath, { start, end });
      const stream = new ReadableStream({
        start(controller) {
          file.on('data', (chunk) => controller.enqueue(chunk));
          file.on('end', () => controller.close());
          file.on('error', (err) => controller.error(err));
        },
      });

      return new NextResponse(stream, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': 'video/mp4',
        },
      });
    } else {
      const file = fs.createReadStream(filePath);
      const stream = new ReadableStream({
        start(controller) {
          file.on('data', (chunk) => controller.enqueue(chunk));
          file.on('end', () => controller.close());
          file.on('error', (err) => controller.error(err));
        },
      });

      return new NextResponse(stream, {
        status: 200,
        headers: {
          'Content-Length': fileSize.toString(),
          'Content-Type': 'video/mp4',
          'Accept-Ranges': 'bytes',
        },
      });
    }
  } catch (error) {
    console.error('Error streaming video:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
