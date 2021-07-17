import asyncio
import os
import discord
from discord.ext import commands, tasks
from itertools import cycle
import time
from datetime import datetime
#날씨 관련
from urllib.request import urlopen
from bs4 import BeautifulSoup
#노래관련
import youtube_dl

client = discord.Client()
TOKEN = 'testNzEyNTc2OTU5MDI0MjAxNzM5.XsTlAg.sQb8INbWFg6CvGpNf3fV8YpX6V0'
GAME = cycle(['현재 봇개발','/help', '코딩'])
bad_msg = ['씨발', '시발', 'ㅅㅂ', '개새끼', '썅', '병신', '용대', '좆']

@client.event
async def on_ready():
    change_status.start()
    print('\n봇이 활성화 되었습니다.')
    print(f'봇 이름 : {client.user.name}')
    print(f'봇 id : {client.user.id}')
    print('===============')

@tasks.loop(seconds=3)
async def change_status():
    #online:온라인 offline:오프라인 dnd:다른용무중 idle:자리비움
    await client.change_presence(status=discord.Status.online, activity=discord.Game(next(GAME)))

@client.event
async def on_message(message):
    #봇일때
    if message.author.bot:
        return None

    else:
    #비속어 필터
        message_contant = message.content
        for i in bad_msg:
            if i in message_contant:
                await message.channel.send(f'욕설을 사용하셧군요\n사용한 욕설 : {str(i)}')
                await message.delete()

    #help
        if message.content == '/help':
            he_embed = discord.Embed(title=f'봇 명령어', color=0x62c1cc)
            he_embed.set_author(name=f'블리츠', icon_url='https://i.pinimg.com/474x/9d/26/29/9d26298676a9dcd4bff41ed81e9c04d7.jpg')
            he_embed.set_thumbnail(url='https://i.pinimg.com/474x/9d/26/29/9d26298676a9dcd4bff41ed81e9c04d7.jpg')
            he_embed.add_field(name=f'/ping', value=f'pong!', inline=False)
            he_embed.add_field(name=f'/핑', value=f'메세지 핑 확인', inline=False)
            he_embed.add_field(name=f'/ping', value=f'/ping', inline=False)
            he_embed.add_field(name=f'/시간', value=f'현재시간 확인', inline=False)
            he_embed.add_field(name=f'/임베드', value=f'/임베드 [title] [text]', inline=False)
            he_embed.add_field(name=f'/타이머', value=f'/타이머 [seconds] [title]', inline=False)
            he_embed.add_field(name=f'블리츠야', value=f'like a 배추봇', inline=False)
            he_embed.add_field(name=f'/날씨', value=f'날씨 알려줌(위치 : 연산9동)', inline=False)
            he_embed.add_field(name=f'/급식', value=f'남일고 급식(식단) 알려줌', inline=False)
            he_embed.add_field(name=f'/식단', value=f'남일고 급식(식단) 알려줌', inline=False)
            await message.channel.send(embed=he_embed)

    #도움말
        if message.content == '/도움말':
            await message.channel.send('/help로 명령어를 확인해주세요.')

    #ping
        if message.content == '/ping':
            await message.channel.send('pong!')

    #핑
        if message.content == '/핑':
            ping1 = time.perf_counter()
            async with message.channel.typing():
                ping2 = time.perf_counter()
            msping = round((ping2 - ping1) * 1000)
            await message.channel.send(f'{msping}ms')

    #시간
        if message.content == '/시간':
            time_embed = discord.Embed(title=f'현재시간', description=f'{datetime.today().month}월 {datetime.today().day}일\n{datetime.today().hour}시 {datetime.today().minute}분 {datetime.today().second}초')
            await message.channel.send(embed=time_embed)

    #임배드
        if message.content.startswith('/임베드'):
            em_text = message.content.split(' ')
            if len(em_text) == 1:
                await message.channel.send('/임베드 [title] [text]')
            elif len(em_text) == 2:
                em_embed = discord.Embed(title=f'{em_text[1]}')
                await message.channel.send(embed=em_embed)
            else:
                args = ' '.join(em_text[2:])
                em_embed = discord.Embed(title=f'{em_text[1]}', description=f'{args}')
                await message.channel.send(embed=em_embed)

    #임배드
        if message.content.startswith('/임배드'):
            await message.channel.send('임배드 X / 임베드 O')

    #clear
        if message.content.startswith('/clear'):
            cl_text = message.content.split(' ')
            if len(cl_text) == 1:
                await message.channel.send('/clear [amount]')
            else:
                try:
                    cl_amount = int(cl_text[1])
                except:
                    await message.channel.send(f'숫자만 입력할수 있습니다.\n입력된 값 : {cl_text[1]}')
                if cl_amount > 10:
                    await message.channel.send(f'최대 10개까지 지울수 있습니다.\n입력된 값 : {cl_text[1]}')
                else:
                    await message.channel.purge(limit = cl_amount + 1)

    #타이머
        if message.content.startswith('/타이머'):
            la_text = message.content.split(' ')
            if len(la_text) == 1:
                await message.channel.send(f'/타이머 [seconds] [title]')
            elif len(la_text) == 2:
                await message.channel.send(f'/타이머 [seconds] [title]')
            else:
                la_title = ' '.join(la_text[2:])
                try:
                    la_amount = int(la_text[1])
                except:
                    await message.channel.send(f'숫자만 입력할수 있습니다.\n입력된 값 : {la_text[1]}')
                if la_amount <= 0:
                    await message.channel.send(f'숫자는 1이상만 입력할수 있습니다.\n입력된 값 : {la_text[1]}')
                else:
                    la_msg = await message.channel.send(f'```\n　\n {la_title} : {la_text[1]}초 (2초마다 표시)\n(오차가 살짝 있습니다.)\n　\n```')
                    time.sleep(0.673)
                    for i in range(la_amount-1, 0, -1):
                        if i > 3:
                            if i%2 == 0:
                                await la_msg.edit(content=f'```\n　\n {la_title} : {str(i)}초 (2초마다 표시)\n(오차가 살짝 있습니다.)\n　\n```')
                        elif i <= 3:
                            await la_msg.edit(content=f'```\n　\n {la_title} : {str(i)}초 \n(오차가 살짝 있습니다.)\n　\n```')
                        time.sleep(0.87505)
                    else:
                        await la_msg.edit(content=f'```\n　\n {la_title} : 종료! \n　\n　\n```')

    #블리츠
        if message.content.startswith('블리츠야'):
            bl_text = message.content.split(' ')
            if len(bl_text) <= 2:
                await message.channel.send(f'블리츠야 [레식대원들] 어때?')
            else:
                if bl_text[2] == '어때?':
                    if bl_text[1] == '아이큐':
                        await message.channel.send(f'그친구 도깨비랑 같이 쓰면')
                        time.sleep(1)
                        await message.channel.send(f'참 좋다더라구')
                    if bl_text[1] == '애쉬':
                        await message.channel.send(f'그친구 게임 던질때 한판씩 하면')
                        time.sleep(0.5)
                        await message.channel.send(f'ㄹㅇ 개꿀잼임 ㅋㅋ')
                else:
                    await message.channel.send(f'블리츠야 [레식대원들] 어때?')

    #날씨
        if message.content == '/날씨':
            await message.channel.send('https://www.weather.go.kr/weather/forecast/timeseries.jsp\n사이트에서 날씨 정보를 불러오는 중입니다...')

            html = urlopen("https://www.weather.go.kr/weather/forecast/timeseries.jsp")  
            soup = BeautifulSoup(html, "html.parser") 
            table = soup.find("table", class_="forecastNew3")

            #날짜
            tr = table.tbody.tr
            weather_day = []
            for t in tr.children:
                if t.name == 'th':
                    if t['scope'] == 'colgroup':
                        num = int(t['colspan'])
                        for i in range(num):
                            weather_day.append(t.get_text())

            #시각
            tr = tr.next_sibling.next_sibling
            weather_time = []
            for t in tr.children:
                if t.name == 'td':
                    for i in t.contents:
                        if i.name =='p':
                            weather_time.append(i.get_text())

            #날씨
            tr = tr.next_sibling.next_sibling
            weather_weather = []
            for w in tr.children:
                if w.name == 'td' and len(w.contents) > 0:
                    weather_weather.append(w['title'])

            #강수확률
            tr = tr.next_sibling.next_sibling
            weather_per = []
            for w in tr.children:
                if w.name == 'td' and len(w.contents) > 0:
                    weather_per.append(w.contents[0])

            #강수량
            tr = tr.next_sibling.next_sibling
            weather_much = []
            for w in tr.children:
                if w.name == 'td' and len(w.contents) > 0:
                    num = int(w['colspan'])
                    for i in range(num):
                        weather_much.append(w.contents[0].strip())

            #기온(℃)
            tr = tr.next_sibling.next_sibling
            weather_tem = []
            for w in tr.children:
                if w.name == 'td' and len(w.contents) > 0:
                    weather_tem.append(w.contents[0].get_text())

            #습도
            tr = tr.next_sibling.next_sibling
            weather_oc = []
            for w in tr.children:
                if w.name == 'td' and len(w.contents) > 0:
                    weather_oc.append(w.contents[0].get_text())

            #명령어
            time.sleep(0.5)
            weather_lst = []
            for wi in range(0, 5):
                weather_lst.append(f'** {weather_time[wi]}시 **\n날씨 : {weather_weather[wi]}\n강수량 : {weather_per[wi]}%\n강수확률 : {weather_much[i]}\n기온 : {weather_tem[i]}℃\n습도 : {weather_oc[i]}%')
            await message.channel.send(f'```fix\n ★ 날씨 ★ \n``````{weather_lst[0]}\n\n{weather_lst[1]}\n\n{weather_lst[2]}\n\n{weather_lst[3]}\n\n{weather_lst[4]}```')

    #급식
        if message.content == '/급식':
            html = urlopen("http://school.busanedu.net/bsnamil-h/main.do")  
            bsObject = BeautifulSoup(html, "html.parser")

            #칼로리
            for meal in bsObject.find_all('dt'):
                kcal = (meal.text.strip(), meal.get('href'))

            #밥
            for meal in bsObject.find_all('dd'):
                bob = (meal.text.strip(), meal.get('href'))

            await message.channel.send(f'```fix\n 오늘({datetime.today().month}월 {datetime.today().day}일)급식 \n```')
            await message.channel.send(f'```{kcal[0]}\n{bob[0]}\n\n(출처 : http://bitly.kr/namilmeal)```')

    #식단
        if message.content == '/식단':
            html = urlopen("http://school.busanedu.net/bsnamil-h/main.do")  
            bsObject = BeautifulSoup(html, "html.parser")

            #칼로리
            for meal in bsObject.find_all('dt'):
                kcal = (meal.text.strip(), meal.get('href'))

            #밥
            for meal in bsObject.find_all('dd'):
                bob = (meal.text.strip(), meal.get('href'))

            await message.channel.send(f'```fix\n 오늘({datetime.today().month}월 {datetime.today().day}일)식단 \n```')
            await message.channel.send(f'```{kcal[0]}\n{bob[0]}\n\n(출처 : http://bitly.kr/namilmeal)```')

    #노래
        if message.content.startswith('/p'):
            msg = message.content.split(' ')
            try:
                url = msg[1]
                url1 = re.match('(https?://)?(www\.)?((youtube\.(com))/watch\?v=([-\w]+)|youtu\.be/([-\w]+))', url)
                if url1 == None:
                    await message.channel.send(message.channel, embed=discord.Embed(title=":no_entry_sign: url을 제대로 입력해주세요.",colour = 0x2EFEF7))
                    return
            except IndexError:
                await message.channel.send(message.channel, embed=discord.Embed(title=":no_entry_sign: url을 입력해주세요.",colour = 0x2EFEF7))
                return
            channel = message.author.voice.voice_channel
            server = message.server
            voice_client = client.voice_client_in(server)
            if client.is_voice_connected(server) and not playerlist[server.id].is_playing():
                await voice_client.disconnect()
            elif client.is_voice_connected(server) and playerlist[sevrer.id].is_playing():
                player = await voice_client.create_ytdl_player(url, after=lambda:queue(sevrer.id),before_options="-reconnect 1 -reconnect_streamed 1 -reconnect_delay_max 5")
                if server.id in que:
                    que[server.id].append(player)
                else:
                    que[server.id] = [player]
                await message.channel.send(message.channel, embed=discord.Embed(title=":white_check_mark: 추가 완료!",colour = 0x2EFEF7))
                playlistappend(player.title)
                return
            def queue(id):
                if que[id] != []:
                    player = que[id].pop(0)
                    playerlist[id] = player
                    del playlist[0]
                    player.start()
            try:
                voice_client = await client.join_voice_channel(channel)
            except discord.errors.InvalidArgument:
                await message.channel.send(message.channel, embed=discord.Embed(title=":no_entry_sign: 음성채널에 접속하고 사용해주세요.",colour = 0x2EFEF7))
                return
            try:
                player = await voice_client.create_ytdl_player(url,after=lambda:queue(server.id),before_options="-reconnect 1 -reconnect_streamed 1 -reconnect_delay_max 5")
                playerlist[server.id] = player
                playlist.append(player.title)
            except youtube_dl.utils.DownloadError: #유저가 제대로 된 유튜브 경로를 입력하지 않았을 때
                await message.channel.send(message.channel, embed=discord.Embed(title=":no_entry_sign: 존재하지 않는 경로입니다.",colour = 0x2EFEF7))
                await voice_client.disconnect()
                return
            player.start()
    #노래 종료
        if message.content == "!종료": #음성채널에서 봇을 나가게 하기
            server = message.server
            voice_client = client.voice_client_in(server)
        
            if voice_client == None: #봇이 음성채널에 접속해있지 않았을 때
                await message.channel.send(message.channel, embed=discord.Embed(title=":no_entry_sign: 봇이 음성채널에 없어요.",colour = 0x2EFEF7))
                return
                
            await message.channel.send(message.channel, embed=discord.Embed(title=":mute: 채널에서 나갑니다.",colour = 0x2EFEF7)) #봇이 음성채널에 접속해있을 때
            await voice_client.disconnect()
    #스킵
        if message.content == "!스킵":
            id = message.server.id
            if not playerlist[id].is_playing(): #재생 중인 음악이 없을 때
                await message.channel.send(message.channel, embed=discord.Embed(title=":no_entry_sign: 스킵할 음악이 없어요.",colour = 0x2EFEF7))
                return
            await message.channel.send(message.channel, embed=discord.Embed(title=":mute: 스킵했어요.",colour = 0x2EFEF7))
            playerlist[id].stop()
    #목록
        if message.content == "!목록":
 
            if playlist == []:
                await message.channel.send(message.channel, embed=discord.Embed(title=":no_entry_sign: 재생목록이 없습니다.",colour = 0x2EFEF7))
                return
        
            playstr = "```css\n[재생목록]\n\n"
            for i in range(0, len(playlist)):
                playstr += str(i+1)+" : "+playlist[i]+"\n"
            await message.channel.send(message.channel, playstr+"```")


client.run(TOKEN)
