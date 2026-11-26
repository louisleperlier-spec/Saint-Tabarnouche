import json, re, os
D = os.path.dirname(os.path.abspath(__file__))
src = open('/mnt/project-files/site-ville/index.html').read()
data = re.search(r'<script type="application/json" id="data">(.*?)</script>', src, re.S).group(1)
cfg8 = json.load(open(f'{D}/day8.json'))['cfg']
dd = json.loads(data); dd['habitants'] = 8971; dd['jour'] = 10; dd['coffre'] = 12000; dd['maj'] = '26 novembre 2026'
data = json.dumps(dd, ensure_ascii=False, indent=1)
cfg8.update({'airport': [110, 100], 'airportOn': True, 'trottoirOn': True, 'trottoir': [-2, 12], 'gifts': ['LP', 'Solopy', 'Gab', 'Kéké', 'Chilly', 'Royal', 'Cora', 'Cla', 'P-Y', 'Thom', 'Vinsso'], 'airportName': 'AÉROPORT LOUIS-P.-TESSIER', 'airportSub': 'ALP · SAINT-TABARNOUCHE', 'statueName': 'LOUIS-P. TESSIER', 'royalQuote': ''})
story = open(f'{D}/story10.js').read().split('\n')
i0 = next(i for i, l in enumerate(story) if l.startswith('// ---------- éclairage'))
i1 = next(i for i, l in enumerate(story) if l.startswith('// ---------- caméra'))
storyBuild = '\n'.join(story[i0:i1])
base = open(f'{D}/base.js').read().split('\n')
assert base[1].startswith('await document.fonts.load')
fonts = "await Promise.race([Promise.all([document.fonts.load('800 40px \"Baloo 2\"'), document.fonts.load('900 40px \"Nunito\"')]), new Promise((r) => setTimeout(r, 2500))]);"
stub = '''const __D = JSON.parse(document.getElementById('data').textContent);
const T = [{ dur: 1, caps: [] }];
const CFG = Object.assign(%s, { popTo: __D.habitants, xmas: true, houseNames: __D.residents.filter((r) => r.lot !== undefined).sort((a, b) => a.lot - b.lot).map((r) => r.p), vote: __D.prochainVote.map((s) => { const i = s.indexOf(' '); return [s.slice(0, i), s.slice(i + 1)]; }) });''' % json.dumps(cfg8, ensure_ascii=False)
js = 'const THREE = window.THREE;' + '\n' + fonts + '\n' + stub + '\n' + '\n'.join(base[2:]) + '\n'
js = js.replace("preserveDrawingBuffer: true", "preserveDrawingBuffer: false")
for w in ['world4.js', 'world5.js', 'world6.js']:
    js += open(f'{D}/{w}').read() + '\n'
js += storyBuild + '\n' + open(f'{D}/argile.js').read() + '\n' + open(f'{D}/explore.js').read() + '\n'
html = open(f'{D}/shell.html').read()
html = html.replace('<!--DATA-->', '<script type="application/json" id="data">' + data + '</script>').replace('/*MAIN*/', js)
open(f'{D}/index.html', 'w').write(html)
print(len(html))
# page complète pour Vercel (racine du repo)
R = os.path.dirname(D)
open(f'{R}/index.html', 'w').write(open(f'{D}/page-head.html').read() + html + open(f'{D}/page-foot.html').read())
