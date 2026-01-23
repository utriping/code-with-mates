

let view = 0;
export async function POST(req){
    //we have to create a sample user with a dummy username and a chatId
    view++;
    const body = await req.json();
    const {username,chatId} = body;
    return NextResponse.json({view,username,chatId});
}   