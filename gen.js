import {nodefs, writeChanged, entity2unicode,readTextContent, patchBuf} from 'ptk/nodebundle.cjs'
await nodefs;
const indir='html/';
const outdir='off/';
const agm=process.argv[2];
let pats=agm||['agms','agmm','agmd','agmu']
if (typeof pats=='string') pats=[pats];
const filecount={'agms':9, 'agmm':11, 'agmd':6,'agmu':9}
const fileprefix={'agms':'222-', 'agmm':'333-', 'agmd':'444-','agmu':'555-'}
const filestart={'agms':/雜阿含經卷第[一二三四五六七八九十]/,'agmm':'中阿含經卷第','agmd':'長阿含經卷第','agmu':'增壹阿含經卷第'};

const files=[];
for (let j=0;j<pats.length;j++) {
    const pat=pats[j];
    for (let i=0;i<=filecount[pat];i++) {
        files.push([pat,fileprefix[pat]+i+'.htm']);
    }
}
let prevpat='',outcontent=[];
const emitfile=(pat)=>{
    writeChanged(outdir+pat+'.wuci.off',outcontent.join('\n'),true);
    outcontent.length=[];
}
const processfile=([pat,fn])=>{
    if (prevpat&&pat!==prevpat) {
        emitfile(prevpat)
    }
    let raw=readTextContent(indir+fn);
    raw=entity2unicode(raw);

    raw=raw.replace(/<[^>]+>/g,'').replace(/\n+/g,'\n');

    const m=raw.match(filestart[pat]);
    prevpat=pat;

    if (!m) return;
    raw=raw.slice(m.index);

    outcontent.push(raw);
}
files.forEach(processfile);
emitfile(prevpat)