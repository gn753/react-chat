# 프로젝트 실시간 1:N 채팅 
![https://velog.velcdn.com/images/gn753/post/38e32245-5316-47c2-b78a-076d70b4f80a/image.gif](https://velog.velcdn.com/images/gn753/post/38e32245-5316-47c2-b78a-076d70b4f80a/image.gif)

## 실행방법

```
npm start

```

### 프로젝트 설명

1대1 채팅 혹은 1:N의 실시간 채팅을 구현했습니다. 회원가입, 로그인, 유저 초대기능 등을 개발했습니다. 

### 기술스택

- React
- material ui
- firebase

### React 프론트 요구사항

- 회원가입
- 로그인
- 채팅로비[공용이 아닌 각 유저가 참여한 방만 보여야함]
- 채팅방 1:N;
- 유저 초대

### 회원가입

파이어베이스 Auth인증을 사용했습니다

상태는 `Email`,`password`,`NickName`

### 로그인

회원가입을 마쳤다면 로그인을 시도하여 FireStore에 등록된 데이터를 비교합니다. 파이어베이스에서 지원하는 

postAuthLogin을 사용했습니다

### 앱 순서

로그인 -> 회원가입 -> 로비 -> 채팅

필요한 페이지는

- 로그인
- 회원가입
- 로비방
- 채팅방

- 로비 입장 시 유저가 입장한 방 목록을 서버로부터 가져옵니다.
- 최신방일수록 위의 차지. 오름차순.

### 상태 설계

```
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

snapshot이라는 것은 messeges collection을 변화를 트랙킹하고 변화 된 정보를 반복문으로 돌려주는 기능을 제공해줍니다.

### 앱의 전역상태

```
 type User = {
  userId:any,
  isLogin:boolean,
 }

```

### 파이어베이스 DB

### DB는 어떻게 구축해야할까?

DB를 어떻게 구성해야 효율적이게 데이터를 전송,관리할수 있을지를 중요하게 생각했습니다.

최초 스키마를 짤 때는 서버에 요청 횟수를 줄여보려 간략히 3가지로 나누었습니다.

- users(유저) : 유저 Key=> 유저 세부데이터 => 입장한 채팅방 Key
- rooms(방) : 채팅방 Key=> 채팅방 내 세부정보 => 입장 유저 Keys
- messags(메시지) : 메시지 Key => 메시지 세부데이터

하지만 막상 작업을 시작하니 데이터 depth가 깊어질 수록 데이터를 관리하기가 어려워지는 문제점이 발생했습니다. 하나의 객체가 많은 역할을 하다보니 데이터의 역할이 파악이 어려워졌습니다.

![https://velog.velcdn.com/images/gn753/post/61bcbfca-78bf-4d31-8fa6-a447648ee488/image.png](https://velog.velcdn.com/images/gn753/post/61bcbfca-78bf-4d31-8fa6-a447648ee488/image.png)

### 다시 한번 재구축한 DB

데이터의 역할을 축소 시켜 데이터가 가리키는 정보가 명확하도록 재 구성했습니다.
각각의 데이터가 가리키는 방향성이 고유해져서 관리하는 측면에서 유리해진 장점이 생겼습니다.

다만 각각의 데이터가 고유해졌기 때문에 서버의 요청횟수가 증가하고 그에 맞는 함수를 추가 작성해야하는 단점도 있었습니다.

- messages(메시지) => 채팅방 Key => 메시지 세부데이터
- roomUsers(방의 유저목록) => 채팅방Id => 채팅방내 유저Key 목록
- userOwnedRooms(입장한 방목록) => 유저ID => 채팅방 Key 목록
- users(유저) => 유저 Key => 유저 세부 데이터

### DB 주석

roomUsers : 채팅방안의 유저목록.
userOwnedRooms : 유저가 입장한 채팅방목록. 때문에 각 유저끼리는 채팅방 갯수가 다를 수가 있음. ex)카카오톡,라인

핵심데이터는 유저ID, 채팅방 ID, 메시지 ID 입니다.

### 핵심 기능

1. 파이어베이스 로그인 인증. 유저가 입장한 채팅방 목록만 보여줍니다.
    
    ![https://velog.velcdn.com/images/gn753/post/9d509fbd-c925-41f6-a7cd-47e2ab00889a/image.gif](https://velog.velcdn.com/images/gn753/post/9d509fbd-c925-41f6-a7cd-47e2ab00889a/image.gif)
    

2.방 생성

![https://velog.velcdn.com/images/gn753/post/d2f53437-016f-4a1c-b3e0-781377bb7a61/image.gif](https://velog.velcdn.com/images/gn753/post/d2f53437-016f-4a1c-b3e0-781377bb7a61/image.gif)

3.실시간 채팅

![https://velog.velcdn.com/images/gn753/post/38e32245-5316-47c2-b78a-076d70b4f80a/image.gif](https://velog.velcdn.com/images/gn753/post/38e32245-5316-47c2-b78a-076d70b4f80a/image.gif)

4.방유저초대

![https://velog.velcdn.com/images/gn753/post/e8654463-fa3f-48d0-8d0d-8c19f557e1a7/image.gif](https://velog.velcdn.com/images/gn753/post/e8654463-fa3f-48d0-8d0d-8c19f557e1a7/image.gif)
