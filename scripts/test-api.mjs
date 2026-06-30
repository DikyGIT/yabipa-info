// API Testing Script - Jalankan: node scripts/test-api.mjs
// Note: Auth endpoints di-test via Playwright E2E
const BASE = "http://localhost:3000";

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌ ${name}: ${e.message}`);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || "Assertion failed");
}

async function run() {
  console.log("\n🧪 API TESTS (Public Endpoints)\n");
  console.log("   Auth testing → playwright test tests/auth.spec.ts\n");

  // ============ BERITA TESTS ============
  console.log("📰 Berita Tests:");

  await test("GET /api/berita - return array", async () => {
    const res = await fetch(`${BASE}/api/berita`);
    assert(res.ok, `Status: ${res.status}`);
    const data = await res.json();
    assert(Array.isArray(data), "Response harus array");
  });

  await test("GET /api/berita - item punya field yang benar", async () => {
    const res = await fetch(`${BASE}/api/berita`);
    const data = await res.json();
    if (data.length > 0) {
      const item = data[0];
      assert(item.id, "Harus ada id");
      assert(item.judul, "Harus ada judul");
      assert(item.createdAt, "Harus ada createdAt");
    }
  });

  // ============ DOKUMEN TESTS ============
  console.log("\n📁 Dokumen Tests:");

  await test("GET /api/dokumen - return array", async () => {
    const res = await fetch(`${BASE}/api/dokumen`);
    assert(res.ok, `Status: ${res.status}`);
    const data = await res.json();
    assert(Array.isArray(data), "Response harus array");
  });

  await test("GET /api/dokumen - item punya aksesRole", async () => {
    const res = await fetch(`${BASE}/api/dokumen`);
    const data = await res.json();
    if (data.length > 0) {
      const item = data[0];
      assert(item.aksesRole, "Harus ada aksesRole");
    }
  });

  await test("GET /api/dokumen?role=GURU - filter by role", async () => {
    const res = await fetch(`${BASE}/api/dokumen?role=GURU`);
    assert(res.ok, `Status: ${res.status}`);
    const data = await res.json();
    assert(Array.isArray(data), "Response harus array");
    data.forEach((d) => {
      assert(d.aksesRole.includes("GURU"), `${d.nama} tidak punya akses GURU`);
    });
  });

  await test("GET /api/dokumen?role=KEPALA - filter by role", async () => {
    const res = await fetch(`${BASE}/api/dokumen?role=KEPALA`);
    assert(res.ok, `Status: ${res.status}`);
    const data = await res.json();
    assert(Array.isArray(data), "Response harus array");
    data.forEach((d) => {
      assert(d.aksesRole.includes("KEPALA"), `${d.nama} tidak punya akses KEPALA`);
    });
  });

  // ============ AUTH PROTECTION TESTS ============
  console.log("\n🔒 Auth Protection Tests:");

  await test("POST /api/berita tanpa auth → 401", async () => {
    const res = await fetch(`${BASE}/api/berita`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ judul: "test", tanggal: "2026-01-01" }),
    });
    assert(res.status === 401, `Status: ${res.status}, seharusnya 401`);
  });

  await test("POST /api/dokumen tanpa auth → 401", async () => {
    const res = await fetch(`${BASE}/api/dokumen`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama: "test", link: "http://test.com" }),
    });
    assert(res.status === 401, `Status: ${res.status}, seharusnya 401`);
  });

  await test("POST /api/users tanpa auth → 401", async () => {
    const res = await fetch(`${BASE}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "test", password: "test", name: "Test", role: "GURU" }),
    });
    assert(res.status === 401, `Status: ${res.status}, seharusnya 401`);
  });

  await test("DELETE /api/berita/[id] tanpa auth → 401", async () => {
    const res = await fetch(`${BASE}/api/berita/fake-id`, { method: "DELETE" });
    assert(res.status === 401, `Status: ${res.status}, seharusnya 401`);
  });

  await test("DELETE /api/dokumen/[id] tanpa auth → 401", async () => {
    const res = await fetch(`${BASE}/api/dokumen/fake-id`, { method: "DELETE" });
    assert(res.status === 401, `Status: ${res.status}, seharusnya 401`);
  });

  await test("DELETE /api/users/[id] tanpa auth → 401", async () => {
    const res = await fetch(`${BASE}/api/users/fake-id`, { method: "DELETE" });
    assert(res.status === 401, `Status: ${res.status}, seharusnya 401`);
  });

  // ============ SUMMARY ============
  console.log(`\n${"=".repeat(40)}`);
  console.log(`📊 Results: ${passed} passed, ${failed} failed`);
  console.log(`${"=".repeat(40)}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

run();
