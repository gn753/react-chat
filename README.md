
## 실행방법

```
npm start
```

### 프로젝트 설명
카카오톡과 같이 1대1 채팅 혹은 1:N의 실시간 채팅을 구현했습니다. 때문에 각 공용 채팅방이 존재하는 
각 유저는 입장한 채팅방 목록을 로그인 시 가져옵니다. 
이전 슬랙처럼 간단한 오픈 채팅방을 만들어 공부해본 적이 있었습니다. 하지만 카카오톡처럼 각 유저들이 입장한 방 목록을 개개인 DB안에 저장하고 보여주는 것은 
처음이었기에 데이터를 구성하는데부터 고생했던 프로젝트였습니다. 



### React 프론트 요구사항
- 회원가입
- 로그인
- 채팅로비[공용이 아닌 각 유저가 참여한 방만 보여야함]
- 채팅방 1:1, 멀티
- 유저 초대

### 회원가입
파이어베이스 Auth인증을 사용한다.

상태는 `Email`,`password`,`NickName`


### 로그인
회원가입을 마쳤다면 로그인을 시도하여 FireStore에 등록된 데이터를 비교한다. 
```js
postAuthLogin({email,password}) {
  
}

```

만약 일치한다면 채팅로비방으로 넘어간다. 




### 앱순서

로그인 -> 회원가입 -> 로비 -> 채팅


필요한 페이지는
- 로그인
- 회원가입
- 로비방
- 채팅방


 서버로부터 모든 방 리스트를 받아옴.
	- 로비대기방 페이지 컴포넌트 들어갈떄 유저가 참여한 방 목록을 서버로부터 가져와야함. 
    - 방목록을 받아오는 동안 loading Spinner 띄우기.
    - 방에는 인원이 몇명인지 체크가능.
    - 최신방일수록 위의 차지. 오름차순.

### 프론트


### 상태 설계 

```ts 
대략의 데이터타입 사전 설계


type Robby = {
 type:Room
}

type Room = {
 RoomId:number,
 RoomTitle:string,
 RoomDetail:string
}

type RoomDetails = {
 RoomMessages:[]
 RoomUsers:[]
}

type RoomMessage = {
  id:number,
  user:string,
  message:string,
}


```

 snapshot이라는 것은 messeges collection을 변화를 트랙킹하고 변화 된 정보를 반복문으로 돌려주는 기능을 제공해준다


### 앱의 전역상태

```ts
 type User = {
  userId:any,
  isLogin:boolean,
 }
```

전역상태는 로그인 on/off 
 

### 서버 [파이어베이스] 데이터

#### DB는 어떻게 짜는게 좋을까? 
처음하는 파이어의 베이스의 DB를 짜는데 꽤나 애먹었다. 

데이터를 어떻게 구축해야 효율적이게 데이터를 관리할 수 있을까가 고민이었다. 서버에 요청횟수가 많을 수록 좋지 않으니 웬만하면 줄여보고 싶엇다. 그러다보니 처음에는 많은 객체를 생성하기보다는 심플하게 구축했다.

- users : 유저 Id=> 유저 세부데이터 => 유저가 입장한 채팅방목록 
- rooms : 채팅방Id => 채팅방 내 세부정보 => 채팅방 내 입장유저목록  
- messags  : 메시지Id => 메시지 세부데이터 

하지만 막상 작업을 시작하니 데이터 depth가 깊어질 수록 데이터를 관리하기가 어려워졌다. 
하나의 데이터가 많은 역할을 하다보니 데이터의 역할이 조금씩 헷갈리기 시작했다. 
 

![](https://velog.velcdn.com/images/gn753/post/61bcbfca-78bf-4d31-8fa6-a447648ee488/image.png)
**파이어베이스 내 구축한 DB**

이번에는 많은 기능을 하기보다는 데이터 또한 함수처럼 단일한 데이터를 구축했다. 
각각의 기능이 고유해져서 데이터 관리가 개선돼 개발하는 입장에서 효율적으로 관리가 가능해졌다.

다만 각각의 기능이 고유해졌기 때문에 서버의 요청횟수가 증가하고 그에 맞는 함수를 추가 작성해야하는게 단점이라면 단점같다. 


messages => 채팅방 ID => 메시지 세부데이터 
roomUsers => 채팅방Id => 채팅방내 유저ID리스트
userOwnedRooms => 유저ID => 채팅방 Id 리스트
users => 유저 ID => 유저 세부데이터




#### DB 주석
roomUsers : 채팅방안의 유저목록. 
userOwnedRooms : 유저가 입장한 채팅방목록. 때문에 각 유저끼리는 채팅방 갯수가 다를 수가 있음. ex)카카오톡,라인

핵심데이터는 유저ID, 채팅방 ID, 메시지 ID 이다.
이 세개의 key값을 통해 클라이언트에서 데이터를 기억하고 이 key값으로 원하는 데이터에 접근한다. 

### 완성한 기능

   
1. 파이어베이스 로그인 인증. 유저가 입장한 채팅방 목록만 보여주기.
![](https://velog.velcdn.com/images/gn753/post/9d509fbd-c925-41f6-a7cd-47e2ab00889a/image.gif)

2.방 생성  
![](https://velog.velcdn.com/images/gn753/post/d2f53437-016f-4a1c-b3e0-781377bb7a61/image.gif)


3.실시간 채팅   

![](https://velog.velcdn.com/images/gn753/post/38e32245-5316-47c2-b78a-076d70b4f80a/image.gif)

4.방유저초대   
![](https://velog.velcdn.com/images/gn753/post/e8654463-fa3f-48d0-8d0d-8c19f557e1a7/image.gif)






