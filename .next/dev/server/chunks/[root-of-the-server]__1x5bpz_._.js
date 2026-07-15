module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Desktop/AquaStep/app/api/puddles/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AquaStep$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/AquaStep/node_modules/next/server.js [app-route] (ecmascript)");
;
const runtime = 'nodejs';
const SUPABASE_URL = process.env.SUPABASE_URL ?? 'https://oazbufyzxoqcbqpuoqvu.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'puddle-photos';
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp'
]);
function requiredText(formData, name) {
    const value = formData.get(name);
    return typeof value === 'string' ? value.trim() : '';
}
function parseNumber(formData, name) {
    const value = Number(requiredText(formData, name));
    return Number.isFinite(value) ? value : null;
}
function extensionFor(photo) {
    if (photo.type === 'image/png') return 'png';
    if (photo.type === 'image/webp') return 'webp';
    return 'jpg';
}
async function POST(request) {
    if (!SUPABASE_KEY) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AquaStep$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Supabaseの認証キーが未設定です。SUPABASE_SERVICE_ROLE_KEYを設定してください。'
        }, {
            status: 503
        });
    }
    try {
        const formData = await request.formData();
        const latitude = parseNumber(formData, 'latitude');
        const longitude = parseNumber(formData, 'longitude');
        const depthCm = parseNumber(formData, 'depthCm');
        const rangeNsM = parseNumber(formData, 'rangeNsM');
        const rangeEwM = parseNumber(formData, 'rangeEwM');
        const observedOn = requiredText(formData, 'observedOn');
        const photo = formData.get('photo');
        if (!(photo instanceof File) || photo.size === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AquaStep$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '写真を選択してください。'
            }, {
                status: 400
            });
        }
        if (!ALLOWED_PHOTO_TYPES.has(photo.type) || photo.size > MAX_PHOTO_BYTES) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AquaStep$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '写真は10MB以下のJPEG・PNG・WebPを選択してください。'
            }, {
                status: 400
            });
        }
        if (latitude === null || latitude < -90 || latitude > 90 || longitude === null || longitude < -180 || longitude > 180) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AquaStep$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '緯度・経度が正しくありません。'
            }, {
                status: 400
            });
        }
        if (depthCm === null || depthCm <= 0 || depthCm > 500 || rangeNsM === null || rangeNsM <= 0 || rangeNsM > 100 || rangeEwM === null || rangeEwM <= 0 || rangeEwM > 100) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AquaStep$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '深さまたは大きさが入力範囲外です。'
            }, {
                status: 400
            });
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(observedOn)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AquaStep$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '観測日が正しくありません。'
            }, {
                status: 400
            });
        }
        const headers = {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`
        };
        const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/puddles`, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json',
                Prefer: 'return=representation'
            },
            body: JSON.stringify({
                latitude,
                longitude,
                range_ns_m: rangeNsM,
                range_ew_m: rangeEwM,
                depth_cm: depthCm,
                observed_on: observedOn,
                status: 'approved'
            })
        });
        if (!insertResponse.ok) {
            const detail = await insertResponse.text();
            console.error('Supabase row insert failed:', detail);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AquaStep$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '水たまり情報の保存に失敗しました。テーブル設定を確認してください。'
            }, {
                status: 502
            });
        }
        const rows = await insertResponse.json();
        const puddle = rows[0];
        if (!puddle?.id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AquaStep$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '登録した水たまりのIDを取得できませんでした。'
            }, {
                status: 502
            });
        }
        // テーブル列は増やさず、行IDで写真との対応が分かるパスに保存します。
        const objectPath = `${puddle.id}/${crypto.randomUUID()}.${extensionFor(photo)}`;
        const uploadResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${objectPath}`, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': photo.type,
                'x-upsert': 'false'
            },
            body: await photo.arrayBuffer()
        });
        if (!uploadResponse.ok) {
            const detail = await uploadResponse.text();
            console.error('Supabase Storage upload failed:', detail);
            await fetch(`${SUPABASE_URL}/rest/v1/puddles?id=eq.${puddle.id}`, {
                method: 'DELETE',
                headers
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AquaStep$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '写真のアップロードに失敗しました。Storage設定を確認してください。'
            }, {
                status: 502
            });
        }
        const photoUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${objectPath}`;
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AquaStep$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            puddle,
            photoUrl,
            photoPath: objectPath
        }, {
            status: 201
        });
    } catch (error) {
        console.error('Puddle registration failed:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$AquaStep$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: '登録処理中に予期しないエラーが発生しました。'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1x5bpz_._.js.map