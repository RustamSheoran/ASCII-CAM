import {
    forwardRef,
    memo,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
} from 'react'
import { AsciiRendererHandle, AsciiSettings, CHAR_SETS, ProcessingStats } from '../types/types'
import { adjustColor, createBrightnessMap, getChar, getLuminance } from '../utils/asciiUtils'
import { RENDER_CONSTANTS } from '../utils/constants'

interface AsciiViewProps {
    settings: AsciiSettings
    stream: MediaStream | null
    onStatsUpdate: (status: ProcessingStats) => void
    canvasSize: {
        width: number
        height: number
    }
}

const AsciiView = forwardRef<AsciiRendererHandle, AsciiViewProps>(
    ({ settings, stream, onStatsUpdate, canvasSize }, ref) => {
        const videoRef = useRef<HTMLVideoElement>(null)
        const canvasRef = useRef<HTMLCanvasElement>(null)
        const hiddenCanvasRef = useRef<HTMLCanvasElement>(null)
        const lastTimeRef = useRef<number>(0)
        const animationIdRef = useRef<number | null>(null)
        const lastStatsUpdateRef = useRef<number>(0)
        const isRenderingRef = useRef<boolean>(true)

        const ramp = CHAR_SETS[settings.characterSet]
        const brightnessMap = useMemo(() => createBrightnessMap(ramp), [ramp])

        useImperativeHandle(ref, () => ({
            getCanvas: () => canvasRef.current,

            captureImage: async () => {
                const video = videoRef.current
                if (!video || video.readyState !== 4) throw new Error('Video not ready')

                const imageSpecs = {
                    height: canvasSize.height * RENDER_CONSTANTS.CAPTURE_SCALE_FACTOR,
                    width: canvasSize.width * RENDER_CONSTANTS.CAPTURE_SCALE_FACTOR,
                    fontSize: settings.fontSize * RENDER_CONSTANTS.CAPTURE_SCALE_FACTOR,
                }

                if (imageSpecs.height <= 0 || imageSpecs.width <= 0)
                    throw new Error('Invalid capture dimensions')

                const tempCanvas = document.createElement('canvas')
                tempCanvas.width = imageSpecs.width
                tempCanvas.height = imageSpecs.height

                const tempCtx = tempCanvas.getContext('2d', { alpha: false })

                const charsX = Math.floor(canvasSize.width / settings.fontSize)
                const charsY = Math.floor(canvasSize.height / settings.fontSize)

                if (charsX <= 0 || charsY <= 0) throw new Error('Invalid character dimensions')

                const analysisCanvas = document.createElement('canvas')
                analysisCanvas.height = charsY
                analysisCanvas.width = charsX
                const analysisCtx = analysisCanvas.getContext('2d')

                if (!tempCtx || !analysisCtx) throw new Error('Canvas initialization failed')

                analysisCtx.drawImage(video, 0, 0, charsX, charsY)

                const imageData = analysisCtx.getImageData(0, 0, charsX, charsY)
                const pixels = imageData.data

                tempCtx.fillStyle = '#000000'
                tempCtx.fillRect(0, 0, imageSpecs.width, imageSpecs.height)
                tempCtx.font = `${imageSpecs.fontSize}px 'Fira Code', monospace`
                tempCtx.textBaseline = 'top'

                const brightnessMap = createBrightnessMap(ramp)

                for (let i = 0; i < charsX * charsY; i++) {
                    const xPos = (i % charsX) * imageSpecs.fontSize
                    const yPos = Math.floor(i / charsX) * imageSpecs.fontSize

                    const r = pixels[i * 4]
                    const g = pixels[i * 4 + 1]
                    const b = pixels[i * 4 + 2]

                    let l = getLuminance(r, g, b)
                    l = adjustColor(l, settings.contrast, settings.brightness)

                    const char = getChar(l, brightnessMap, settings.invert)

                    if (settings.colorMode) {
                        tempCtx.fillStyle = `rgb(${r},${g},${b})`
                    } else {
                        tempCtx.fillStyle = settings.invert ? '#000000' : '#00ff00'
                    }

                    tempCtx.fillText(char, xPos, yPos)
                }

                return tempCanvas.toDataURL('image/png')
            },

            getAsciiText: () => {
                const video = videoRef.current
                if (!video || video.readyState !== 4 || !video.videoWidth || !video.videoHeight)
                    return ''
                const tempCanvas = document.createElement('canvas')
                const aspectRatio = video.videoHeight / video.videoWidth
                const standardHeight = Math.max(
                    1,
                    Math.floor(RENDER_CONSTANTS.CLIPBOARD_WIDTH * aspectRatio * 0.55),
                )

                tempCanvas.width = RENDER_CONSTANTS.CLIPBOARD_WIDTH
                tempCanvas.height = standardHeight

                const tempCtx = tempCanvas.getContext('2d')
                if (!tempCtx) return ''

                tempCtx.drawImage(video, 0, 0, RENDER_CONSTANTS.CLIPBOARD_WIDTH, standardHeight)
                const imageData = tempCtx.getImageData(
                    0,
                    0,
                    RENDER_CONSTANTS.CLIPBOARD_WIDTH,
                    standardHeight,
                )
                const pixels = imageData.data

                const brightnessMap = createBrightnessMap(ramp)

                const rows: string[] = []

                for (let y = 0; y < standardHeight; y++) {
                    const rowChars: string[] = []
                    for (let x = 0; x < RENDER_CONSTANTS.CLIPBOARD_WIDTH; x++) {
                        const idx = (y * RENDER_CONSTANTS.CLIPBOARD_WIDTH + x) * 4
                        const l = getLuminance(pixels[idx], pixels[idx + 1], pixels[idx + 2]) // R G B
                        const adjL = adjustColor(l, settings.contrast, settings.brightness)
                        const char = getChar(adjL, brightnessMap, settings.invert)

                        rowChars.push(char)
                    }
                    rows.push(rowChars.join(''))
                }
                return rows.join('\n')
            },
        }))

        const renderCanvas = useCallback(
            (time: number) => {
                if (!isRenderingRef.current) return

                const startRender = performance.now()
                const delta = time - lastTimeRef.current
                lastTimeRef.current = time
                const fps = 1000 / delta

                const video = videoRef.current
                const canvas = canvasRef.current
                if (!canvas || !video) {
                    if (isRenderingRef.current) {
                        animationIdRef.current = requestAnimationFrame(t => renderCanvas(t))
                    }
                    return
                }

                const ctx = canvas.getContext('2d', { alpha: false })

                if (!ctx) {
                    if (isRenderingRef.current) {
                        animationIdRef.current = requestAnimationFrame(t => renderCanvas(t))
                    }
                    return
                }

                const fontScale = settings.fontSize || 10

                const srcW = Math.floor(canvasSize.width / fontScale)
                const srcH = Math.floor(canvasSize.height / fontScale)

                if (srcW <= 0 || srcH <= 0) {
                    if (isRenderingRef.current) {
                        animationIdRef.current = requestAnimationFrame(t => renderCanvas(t))
                    }
                    return
                }

                if (!hiddenCanvasRef.current) {
                    if (isRenderingRef.current) {
                        animationIdRef.current = requestAnimationFrame(t => renderCanvas(t))
                    }
                    return
                }

                if (hiddenCanvasRef.current) {
                    if (
                        hiddenCanvasRef.current.width !== srcW ||
                        hiddenCanvasRef.current.height !== srcH
                    ) {
                        hiddenCanvasRef.current.width = srcW
                        hiddenCanvasRef.current.height = srcH
                    }
                }

                const hiddenCanvas = hiddenCanvasRef.current
                const hiddenCtx = hiddenCanvas.getContext('2d', { willReadFrequently: true })

                if (!hiddenCtx) {
                    if (isRenderingRef.current) {
                        animationIdRef.current = requestAnimationFrame(t => renderCanvas(t))
                    }
                    return
                }

                try {
                    hiddenCtx.drawImage(video, 0, 0, srcW, srcH)
                } catch {
                    if (isRenderingRef.current) {
                        animationIdRef.current = requestAnimationFrame(t => renderCanvas(t))
                    }
                    return
                }

                const pixels = hiddenCtx.getImageData(0, 0, srcW, srcH).data

                const { contrast, brightness: brightnessOffset, colorMode, invert } = settings

                // draw ASCII on the visible canvas
                canvas.width = srcW * fontScale
                canvas.height = srcH * fontScale

                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.font = `${fontScale}px 'Fira Code', monospace`

                ctx.fillStyle = invert ? '#00ff00' : '#000000'
                ctx.textBaseline = 'top'

                const pixelCount = srcW * srcH

                for (let i = 0; i < pixelCount; i++) {
                    const r = pixels[i * 4]
                    const g = pixels[i * 4 + 1]
                    const b = pixels[i * 4 + 2]

                    let l = 0.299 * r + 0.587 * g + 0.114 * b

                    if (contrast !== 1.0 || brightnessOffset !== 0) {
                        l = adjustColor(l, contrast, brightnessOffset)
                    }

                    const char = getChar(l, brightnessMap, invert)

                    const x = (i % srcW) * fontScale
                    const y = Math.floor(i / srcW) * fontScale

                    if (colorMode) {
                        ctx.fillStyle = `rgb(${r},${g},${b})`
                    } else {
                        ctx.fillStyle = invert ? '#000000' : '#00ff00'
                    }

                    ctx.fillText(char, x, y)
                }

                const endRender = performance.now()

                const now = performance.now()
                if (now - lastStatsUpdateRef.current > RENDER_CONSTANTS.STATS_UPDATE_INTERVAL_MS) {
                    onStatsUpdate({ fps, renderTime: endRender - startRender })
                    lastStatsUpdateRef.current = now
                }
                if (isRenderingRef.current) {
                    animationIdRef.current = requestAnimationFrame(t => renderCanvas(t))
                }
            },
            [settings, canvasSize.height, canvasSize.width, onStatsUpdate, brightnessMap],
        )

        useEffect(() => {
            if (!stream) return

            isRenderingRef.current = true

            const video = videoRef.current
            if (!video) return

            video.srcObject = stream
            video.play()

            animationIdRef.current = requestAnimationFrame(t => renderCanvas(t))

            return () => {
                isRenderingRef.current = false
                if (animationIdRef.current !== null) {
                    cancelAnimationFrame(animationIdRef.current)
                }
            }
        }, [renderCanvas, stream])

        return (
            <>
                <div className="h-screen w-screen -z-10 flex justify-center items-center">
                    <video
                        ref={videoRef}
                        height={'screen'}
                        width={'screen'}
                        style={{ display: 'none' }}
                        playsInline
                        muted
                    />
                    <canvas ref={hiddenCanvasRef} className="hidden -z-10" />
                    <canvas
                        ref={canvasRef}
                        width={canvasSize.width}
                        height={canvasSize.height}
                        className="bg-transparent -z-10"
                    />
                </div>
            </>
        )
    },
)

export default memo(AsciiView)
