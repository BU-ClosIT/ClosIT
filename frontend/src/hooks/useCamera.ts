import { useCallback, useEffect, useRef, useState } from "react";

type FacingMode = "environment" | "user";

export function useCamera(initialFacing: FacingMode = "environment") {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [facingMode, setFacingMode] = useState<FacingMode>(() => {
    try {
      const saved = localStorage.getItem("cameraFacingMode");
      return (saved as FacingMode) || initialFacing;
    } catch {
      return initialFacing;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cameraFacingMode", facingMode);
    } catch {}
  }, [facingMode]);

  const start = useCallback(async () => {
    if (cameraOn) return;
    const constraints: MediaStreamConstraints = {
      video: { facingMode },
      audio: false,
    };
    try {
      const s = await navigator.mediaDevices.getUserMedia(constraints);
      // store stream immediately
      streamRef.current = s;
      // flip the cameraOn flag so the video element is rendered on the next tick
      setCameraOn(true);

      // Try to attach the stream to the video element. The video element may not
      // be mounted yet, so retry a few times with a short delay.
      for (let i = 0; i < 10; i++) {
        if (videoRef.current) {
          try {
            videoRef.current.srcObject = s;
            // some browsers require muted/autoPlay to allow play(); swallow errors
            // but attempt to play so the preview starts when possible
            await videoRef.current.play().catch(() => {});
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {
            // ignore and continue retrying
          }
          break;
        }
        // wait 100ms and try again
        await new Promise((r) => setTimeout(r, 100));
      }

      return s;
    } catch (err) {
      setCameraOn(false);
      throw err;
    }
  }, [cameraOn, facingMode]);

  // If cameraOn becomes true after the video element mounts, ensure the
  // stream is attached and play is attempted.
  useEffect(() => {
    if (!cameraOn) return;
    const s = streamRef.current;
    if (!s) return;
    if (videoRef.current) {
      try {
        videoRef.current.srcObject = s;
        videoRef.current.play().catch(() => {});
      } catch {}
    }
  }, [cameraOn]);

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  }, []);

  const capture = useCallback((): File | null => {
    const video = videoRef.current;
    if (!video) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    // convert dataURL to blob
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], { type: mime });
    const file = new File([blob], `photo_${Date.now()}.jpg`, { type: mime });
    return file;
  }, []);

  const toggleFacing = useCallback(() => {
    setFacingMode((m) => (m === "environment" ? "user" : "environment"));
  }, []);

  useEffect(() => {
    // if camera is on and facing mode changes, restart to apply constraint
    if (!cameraOn) return;
    (async () => {
      stop();
      try {
        await start();
      } catch {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  return {
    videoRef,
    start,
    stop,
    capture,
    cameraOn,
    facingMode,
    toggleFacing,
  } as const;
}
