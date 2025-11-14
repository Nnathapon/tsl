import { describe, test, expect } from 'vitest';
import getYouTubeEmbedUrl from '../yt';

describe('getYouTubeEmbedUrl', () => {

  test('returns null when url is null', () => {
    expect(getYouTubeEmbedUrl(null)).toBeNull();
  });

  test('converts standard YouTube watch URL', () => {
    const url = 'https://www.youtube.com/watch?v=ABC123xyz';
    expect(getYouTubeEmbedUrl(url)).toBe('https://www.youtube.com/embed/ABC123xyz');
  });

  test('converts youtube.com with www', () => {
    const url = 'https://www.youtube.com/watch?v=ID123';
    expect(getYouTubeEmbedUrl(url)).toBe('https://www.youtube.com/embed/ID123');
  });

  test('converts youtube.com with subdomain', () => {
    const url = 'https://m.youtube.com/watch?v=QWE456';
    expect(getYouTubeEmbedUrl(url)).toBe('https://www.youtube.com/embed/QWE456');
  });

  test('converts youtu.be short URL', () => {
    const url = 'https://youtu.be/DEF456ghi';
    expect(getYouTubeEmbedUrl(url)).toBe('https://www.youtube.com/embed/DEF456ghi');
  });

  test('returns null when youtube.com URL has no video ID', () => {
    const url = 'https://www.youtube.com/watch?foo=bar';
    expect(getYouTubeEmbedUrl(url)).toBeNull();
  });

  test('returns null for non-youtube hostname', () => {
    const url = 'https://example.com/watch?v=123';
    expect(getYouTubeEmbedUrl(url)).toBeNull();
  });

  test('returns null for invalid URL string', () => {
    const url = 'this-is-not-a-url';
    expect(getYouTubeEmbedUrl(url)).toBeNull();
  });

  test('handles youtu.be URL with empty pathname', () => {
    const url = 'https://youtu.be/';
    expect(getYouTubeEmbedUrl(url)).toBeNull();
  });

  test('handles youtube.com URL with empty search params', () => {
    const url = 'https://www.youtube.com/watch?v=';
    expect(getYouTubeEmbedUrl(url)).toBeNull();
  });

});