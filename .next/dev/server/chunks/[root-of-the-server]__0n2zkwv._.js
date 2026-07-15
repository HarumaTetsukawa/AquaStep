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
"[project]/lib/geojson/puddles.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "geoJsonFeatureToPuddle",
    ()=>geoJsonFeatureToPuddle,
    "geoJsonToPuddles",
    ()=>geoJsonToPuddles,
    "puddleRowsToGeoJson",
    ()=>puddleRowsToGeoJson
]);
function toNumber(value) {
    return typeof value === 'number' ? value : Number(value);
}
function getRiskLevel(depthCm) {
    if (depthCm >= 5) return 'high';
    if (depthCm >= 2) return 'medium';
    return 'low';
}
function formatObservedAt(date) {
    return date.includes(' ') ? date : `${date} 00:00`;
}
function getImageUrl(row) {
    return row.image_url ?? row.photo_url ?? row.puddle_image_url ?? row.image_path ?? row.photo_path ?? row.storage_path ?? null;
}
function puddleRowsToGeoJson(rows) {
    return {
        type: 'FeatureCollection',
        features: rows.map((row)=>({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [
                        toNumber(row.longitude),
                        toNumber(row.latitude)
                    ]
                },
                properties: {
                    id: row.id,
                    range_ns: toNumber(row.range_ns_m),
                    range_ew: toNumber(row.range_ew_m),
                    depth: toNumber(row.depth_cm),
                    date: row.observed_on,
                    imageUrl: getImageUrl(row)
                }
            }))
    };
}
function geoJsonFeatureToPuddle(feature) {
    const [lng, lat] = feature.geometry.coordinates;
    const { id, range_ns, range_ew, depth, date, imageUrl } = feature.properties;
    const diameterCm = Math.round(Math.max(range_ns, range_ew) * 100);
    const risk = getRiskLevel(depth);
    return {
        id: String(id),
        name: `水たまり #${id}`,
        lat,
        lng,
        diameterCm,
        depthCm: depth,
        slipRisk: risk,
        fallRisk: risk,
        nightRisk: risk,
        updatedAt: formatObservedAt(date),
        note: `南北 ${range_ns}m / 東西 ${range_ew}m`,
        imageUrl
    };
}
function geoJsonToPuddles(geoJson) {
    return geoJson.features.map(geoJsonFeatureToPuddle);
}
}),
"[project]/lib/supabase/server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabaseAdmin",
    ()=>supabaseAdmin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl) {
    throw new Error('SUPABASE_URL is not set');
}
if (!supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
}
const supabaseAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
}),
"[project]/app/api/puddles/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$geojson$2f$puddles$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/geojson/puddles.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
;
;
;
const dynamic = 'force-dynamic';
const PUDDLE_PHOTO_BUCKET = 'puddle-photos';
const SIGNED_PHOTO_URL_TTL_SECONDS = 60 * 60;
function parseNumberParam(value) {
    if (value === null) return null;
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : null;
}
async function getPuddlePhotoUrl(puddleId) {
    const folder = String(puddleId);
    const { data: files, error: listError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].storage.from(PUDDLE_PHOTO_BUCKET).list(folder, {
        limit: 1,
        sortBy: {
            column: 'created_at',
            order: 'desc'
        }
    });
    if (listError) {
        console.error(`Failed to list puddle photo files for ${puddleId}:`, listError);
        return null;
    }
    const file = files?.find((item)=>item.id !== null);
    if (!file) {
        return null;
    }
    const path = `${folder}/${file.name}`;
    const { data: signedUrlData, error: signedUrlError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].storage.from(PUDDLE_PHOTO_BUCKET).createSignedUrl(path, SIGNED_PHOTO_URL_TTL_SECONDS);
    if (signedUrlError) {
        console.error(`Failed to create signed puddle photo URL for ${path}:`, signedUrlError);
        return null;
    }
    return signedUrlData.signedUrl;
}
async function attachPuddlePhotoUrls(rows) {
    return Promise.all(rows.map(async (row)=>({
            ...row,
            image_url: row.image_url ?? await getPuddlePhotoUrl(row.id)
        })));
}
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const minLng = parseNumberParam(searchParams.get('minLng'));
    const maxLng = parseNumberParam(searchParams.get('maxLng'));
    const minLat = parseNumberParam(searchParams.get('minLat'));
    const maxLat = parseNumberParam(searchParams.get('maxLat'));
    let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('puddles').select('*').eq('status', 'approved').order('id', {
        ascending: true
    });
    if (minLng !== null && maxLng !== null && minLat !== null && maxLat !== null) {
        query = query.gte('longitude', minLng).lte('longitude', maxLng).gte('latitude', minLat).lte('latitude', maxLat);
    }
    const { data, error } = await query;
    if (error) {
        console.error('Failed to fetch puddles:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: '水たまりデータの取得に失敗しました'
        }, {
            status: 500
        });
    }
    const rows = await attachPuddlePhotoUrls(data ?? []);
    const geoJson = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$geojson$2f$puddles$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["puddleRowsToGeoJson"])(rows);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(geoJson, {
        headers: {
            'Cache-Control': 'no-store'
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0n2zkwv._.js.map