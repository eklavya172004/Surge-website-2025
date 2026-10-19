# Landing media and interaction performance

The original phone styles hid the large logo/video and the blue side decorations,
and collapsed the hero spacer. Phones now get a naturally scrolling hero with the
same logo cutout and footage. Desktop retains its shrinking logo animation. Scroll
updates are limited to animation frames and stop writing styles after the logo is
fully shrunk.

The page loads behind the existing first-visit loader, allowing media and fonts to
start loading immediately. It remains inert and hidden from accessibility tools
until the loader is dismissed. The loader appearance and duration are unchanged.
Invalid duplicate font URLs were removed in favour of the existing global fonts.

## Video assets

The source is the existing public event video:
https://odn56sq2gn.ufs.sh/f/1wdHEmtejGdKHxkVNynKdsRFgkCb8zj7DAiZPqNxYeuvyLl6

All versions contain the same footage at 30 fps. The original was 20,261,373 bytes
with an audio track that the site always muted. The checked-in H.264/yuv420p files
omit audio and put MP4 metadata before the media data for progressive playback:

| Asset | Dimensions | Bytes |
| --- | --- | --- |
| Desktop | 1280 × 720 | 9,785,422 |
| Phone | 640 × 360 | 3,342,605 |

Phone transfer size is about 84% smaller. A WebP frame supplies the poster and
error fallback. Playback is muted and inline; a play button appears when autoplay
is blocked. The phone video pauses when its hero is outside the viewport. All
video pauses while the document is hidden and resumes when visible again.

Rebuild from a local copy of the source with FFmpeg:

```sh
ffmpeg -i source.mp4 -map 0:v:0 -an -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -movflags +faststart public/media/surge-hero.mp4
ffmpeg -i source.mp4 -map 0:v:0 -an -vf scale=640:-2 -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -movflags +faststart public/media/surge-hero-mobile.mp4
ffmpeg -ss 1 -i source.mp4 -frames:v 1 -vf scale=960:-2 -c:v libwebp -quality 80 public/media/surge-hero-poster.webp
```

Safari playback policy: https://developer.apple.com/documentation/webkit/delivering-video-content-for-safari

See the campus-map README for map changes and regression checks. Browser viewport
checks verify responsive layout and playback; physical iPhone testing is still
needed for device-specific autoplay restrictions and touch smoothness.
