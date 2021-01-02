let user: any;
let id: any;

const EC = {
    share : undefined,
    auth : "",
    pj: {
        titl : undefined,
        like : undefined,
        view : undefined,
        creator : undefined,
        remake : undefined,
    },
    sns: {
        titl : undefined,
        id : undefined,
        like : undefined,
        view : undefined,
        writer : undefined,
    }
}

$.ajaxSetup({ async: false });

const entry = {
    project(projectimport: any) {
        return {
            get(imported: any) {
                $.get(`https://playentry.org/api/project/${projectimport}`, data => {
                    function getimport(get: string,rtrn: any) {
                        if(imported == get) {
                            EC.share = rtrn;
                        }
                    }
                    EC.pj.titl = data.name;
                    EC.pj.like = data.likeCnt;
                    EC.pj.view = data.visit;
                    EC.pj.creator = data.username;
                    EC.pj.remake = data.childCnt;
                    getimport("title", EC.pj.titl);
                    getimport("like", EC.pj.like);
                    getimport("view", EC.pj.view);
                    getimport("creator", EC.pj.creator);
                    getimport("remake", EC.pj.remake);
                })
                return EC.share;
            },
            like() {
                $.ajax({
                    url: `https://playentry.org/api/project/like/${projectimport}`,
                    type: "POST",
                    data: {
                        targetSubject: "project", targetType: "individual"
                    }
                })
            },
            star() {
                $.ajax({
                    url: `https://playentry.org/api/project/favorite/${projectimport}`,
                    type: "POST",
                    data: {
                        targetSubject: "project", targetType: "individual"
                    }
                })
            },
            save(save: any) {
                if(save == undefined) {
                    $.ajax({
                        url: `https://playentry.org/api/project/${projectimport}`,
                        type: "PUT",
                        data: {
                            isopen : true
                        },
                    })
                }else{
                    $.ajax({
                        url: `https://playentry.org/api/project/${projectimport}`,
                        type: "PUT",
                        data: {
                            isopen : true,
                            name : save
                        }
                    })
                }
            },
            comment(comment: string) {
                $.ajax({
                    url: `https://playentry.org/api/comment`,
                    type: "POST",
                    data: {
                        targetSubject: "project", 
                        targetType: "individual",
                        content: comment,
                        target: projectimport,
                    }
                })
            }
        }
    },
    sns(snsselect: string){
        return {
            write(title: string,contents: string) {
                $.ajax({
                    url:"https://playentry.org/api/discuss/",
                    type:"POST",
                    data:{
                        content : contents,
                        title : title,
                        groupNotice : false,
                        images : [],
                        category: snsselect
                    }
                });
            },
            get(geting: any) {
                if(snsselect == "tip"||snsselect == "qna"||snsselect == "free") {
                    if(snsselect == "tip") {
                        $.get(`https://playentry.org/api/discuss/find?category=${snsselect}s`, ({data}) => {
                            EC.share = data[geting - 1]._id
                        })
                    }else{
                        $.get(`https://playentry.org/api/discuss/find?category=${snsselect}`, ({data}) => {
                            EC.share = data[geting - 1]._id
                        })
                    }
                }else{
                    $.get(`https://playentry.org/api/discuss/${snsselect}`, data => {
                        function getimport(get: string,rtrn: any) {
                            if(geting == get) {
                                EC.share = rtrn;
                            }
                        }
                        EC.sns.titl = data.title;
                        EC.sns.like = data.likesLength;
                        EC.sns.view = data.visit;
                        EC.sns.writer = data.owner;
                        EC.sns.id = data._id;
                        getimport("title", EC.sns.titl);
                        getimport("like", EC.sns.like);
                        getimport("view", EC.sns.view);
                        getimport("writer", EC.sns.writer);
                        getimport("id", EC.sns.id);
                    })
                }
                return EC.share
            },
            comment(content: string) {
                $.ajax({
                    url: `https://playentry.org/api/comment`,
                    type: "POST",
                    data: {
                        targetSubject: "discuss", 
                        targetType: "individual",
                        content: content,
                        target: snsselect,
                    }
                })
            },
            like() {
                $.ajax({
                    url: `https://playentry.org/api/discuss/like/${snsselect}?targetSubject=discuss&targetType=individual`,
                    type: "POST",
                    data: {
                        targetSubject: "discuss", targetType: "individual"
                    }
                })
            }
        }
    },
    user: {
        intro: {
            get(imported: string) {
                if(imported == "backimg"){
                    EC.share = `https://playentry.org/uploads/profile/${user._id.slice(0,2)}/${user._id.slice(2,4)}/blog_${user._id}.png`
                }
                if(imported == "profile"){
                    EC.share = `https://playentry.org/uploads/profile/${user._id.slice(0,2)}/${user._id.slice(2,4)}/avatar_${user._id}.png`
                }
                if(imported == "title"){
                    $.get(`https://playentry.org/api/getUserByUsername/${user.username}`, d => {
                        EC.share = d.description;
                    })
                }
                return EC.share
            },
            set: {
                title(title: string) {
                    $.ajax({
                        url: `https://playentry.org/rest/picture/upload_confirm`,
                        type: "POST",
                        data: {
                            avatarImage: true,
                            blogImage: entry.user.intro.get("backimg"),
                            description: title
                        }
                    })
                }
            }
        }
    }
}

function at() {
    if(EC.auth == "글") {entry.sns = undefined}
    if(EC.auth == "작품") {entry.project = undefined}
    if(EC.auth == "계정") {entry.user = undefined}
}

function con(con: string) {
    if(confirm(`${con} 권한을 허용하시겠습니까?`) == true) {
        console.warn(`${con} 권한을 허용했습니다.`);
        EC.auth = con
    }else{
        EC.auth = con
        at()
        console.log("권한을 거부했습니다.");
    }
}

con('글')
con('작품')
con('계정')