# Open Together, O2



<br></br>
# 프로젝트 설명
예비 창업가가 회고와 강연을 통해 더 성장할 수 있는 기회를 제공하는 커뮤니티 플랫폼. 오투의 메인 기능으로는 회고를 원하는 기간에 맞춰서 쓰는 Learn Myself와 본인이 직접 연사가 되어볼 수 있고 다른 사람들의 성장 및 창업 스토리를 들어볼 수 있는 Share Together가 있습니다.

<br></br>
# 서버 아키텍쳐
```
📦src
 ┣ 📂config
 ┃ ┗ 📜index.ts
 ┣ 📂library
 ┃ ┣ 📜response.ts
 ┃ ┣ 📜returnCode.ts
 ┃ ┣ 📜jwt.ts
 ┃ ┗ 📜date.ts
 ┣ 📂Loader
 ┃ ┗ 📜db.ts
 ┣ 📂interfaces
 ┃ ┣ 📜IComment.ts
 ┃ ┣ 📜ILikes.ts
 ┃ ┣ 📜IScraps.ts
 ┃ ┣ 📜IAdmin.ts
 ┃ ┣ 📜IConcert.ts
 ┃ ┣ 📜IBadge.ts
 ┃ ┣ 📜IChallenge.ts
 ┃ ┗ 📜IUser.ts
 ┣ 📂middleware
 ┃ ┣ 📜auth.ts
 ┃ ┣ 📜challenge.ts
 ┃ ┗ 📜upload.ts
 ┣ 📂models
 ┃ ┣ 📜Comment.ts
 ┃ ┣ 📜Admin.ts
 ┃ ┣ 📜Concert.ts
 ┃ ┣ 📜Badge.ts
 ┃ ┣ 📜Challenge.ts
 ┃ ┗ 📜User.ts
 ┣ 📂service
 ┃ ┣ 📜authService.ts
 ┃ ┣ 📜adminService.ts
 ┃ ┣ 📜challengeService.ts
 ┃ ┗ 📜concertService.ts
 ┣ 📂controller
 ┃ ┣ 📜admin.ts
 ┃ ┣ 📜auth.ts
 ┃ ┣ 📜challenge.ts
 ┃ ┗ 📜concert.ts
 ┗ 📜index.ts
```
<br></br>
# dependencies module
```json
  "devDependencies": {
    "@types/bcryptjs": "^2.4.2",
    "@types/express": "^4.17.12",
    "@types/mongoose": "^5.11.97",
    "@types/node": "^15.12.5",
    "@typescript-eslint/eslint-plugin": "^4.28.1",
    "@typescript-eslint/parser": "^4.28.1",
    "eslint": "^7.29.0",
    "eslint-config-prettier": "^8.3.0",
    "eslint-plugin-import": "^2.23.4",
    "eslint-plugin-prettier": "^3.4.0",
    "nodemon": "^2.0.7",
    "prettier": "^2.3.2",
    "prettier-eslint": "^12.0.0",
    "ts-node": "^10.0.0",
    "tsconfig-paths": "^3.9.0",
    "typescript": "^4.3.5"
  },
  "dependencies": {
    "aws-sdk": "^2.939.0",
    "bcryptjs": "^2.4.3",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "express-validator": "^6.12.0",
    "jsonwebtoken": "^8.5.1",
    "moment": "^2.29.1",
    "mongoose": "^5.13.0",
    "mongoose-validator": "^2.1.0",
    "multer": "^1.4.2",
    "multer-s3": "^2.9.0",
    "request": "^2.88.2"
  },
```

<br></br>
# Code Convention
### 명명법
---
1. **low camel case**를 사용한다.
2. 함수명 → 동사+명사 순서로 작성한다.
3. 변수명 → 명사들의 결합으로 작성한다.

### **주석 규칙**
---
1. 한줄은 //로 적고, 그 이상은 /** */로 적는다.

```jsx
// 한줄 주석일 때
/**
 * 여러줄
 * 주석일 때
 */
```

 2. **함수에 대한 주석**

1) backend에서 공통적으로 사용하는 함수의 경우, 모듈화를 통해 하나의 파일로 관리한다.

2) 하나의 파일의 시작 부분에 주석으로 상세 내용을 작성한다.

  - **함수의 전체 기능**에 대한 설명
  - **함수의 파라미터**에 대한 설명 (type: ..., 역할)
  - router 또는 api일 때에는 성공 여부도 적어준다.
  - 예시 코드

  ```jsx
  /**
   * @api {get} /study/:roomNumber/questions?sort_by=created&order_by=asc 방의 질문 목록을 가져옴
   * @apiName GetQuestions
   * @apiGroup Question
   *
   * @apiParam {String} roomNumber 유일한 방 번호
   *
   * @apiSuccess {Boolean} success API 호출 성공 여부
   * @apiSuccess {String} message 응답 메시지
   * @apiSuccess {Object} data 해당 방의 질문 리스트
   */
  router.get(
    "/study/:roomNumber/questions",
    [checkParamAndQuery("roomNumber").isNumeric()],
    getQuestions.default
  );
  ```

  나중에 배울 **apidoc**에 쓰일 형식이다!

### **비동기 함수의 사용**
---
Promise함수의 사용은 지양하고 **async, await**를 사용하도록 한다.

다만 로직을 짜는 데 있어 promise를 불가피하게 사용할 경우, 주석으로 표시하고 commit에 그 이유를 작성한다.

### **데이터 베이스 명명 규칙**
---
1. **DB 이름 (스키마)**
    - 데이터베이스 명은 영어 대문자로 구성한다.
    - 길이는 8자 이내로 구성한다.
2. **컬렉션**
    - 소문자사용
    - 's' 를 사용(ex, users profiles)
    - 컬렉션 명의 구성은 최대 3단어까지 사용할 수 있다.
    - 최대 길이는 26자 이내로 구성한다.
3. **컬럼**
    - 컬럼은 snake 표기법을 따르고, 의미있는 컬럼명_접미사 형태로 작성한다.
    - 컬럼의 성질을 나타내는 접미사를 사용한다. (사용하는 데이터의 타입을 나타내는 것이 아님에 유의)

### **접미사 list**
---
- **CNT :** count 조회수 등의 count에 사용된다.
- **DT :** date 날짜인 경우를 나타낸다.
- **FK :** foreign key를 나타내는데 사용한다.
- **FL :** flag 0, 1로 구성된 상태를 나타낸다.
- **ID :** id 계정 등의 아이디를 나타낸다.
- **NM :** name 이름, 별명 등 식별 가능하며 중복이 가능한 문자열 나타내는 데 사용한다.
- **NO :** number 나이, 휴대폰 번호 등 숫자를 나타낸다.
- **ORD :** order 정렬에 사용되는 index를 나타낸다.
- **PK :** primary key를 나타내는데 사용한다.
- **ST :** status 회원의 등급, 성별 등의 상태를 나타낸다.

<br></br>
# git commit, branch
### **types**
---
- chore: 프로덕션 코드가 바뀌지 않은 가벼운 일들
- docs(or doc): 도큐먼트/문서화 업데이트
- **feat: 새로운 기능/특징**
- **fix: 버그를 고침**
- **hotfix: 시급한 버그를 고침 - 현 production에 critical**
- refactor: production 코드를 리팩토링(아마도 3주차 혹은 앱잼 이후 할듯)
- style: Code의 스타일, 포맷 등이 바뀐 경우 - 세미콜론(;)이 빠졌다거나 등(eslint, prettier 사용하여 해당 타입을 쓸 일이 없을 것이라 예상)
- test: 테스트 코드 추가 및 업데이트
- deps: Dependency와 관련 있는 내용

### Git branch 이름 작명
---
1. 브랜치 이름은 영어로 짓는다.
2. 슬래시(`/`)로 카테고리화 시키고, 뒤에 붙는 기능 및 내용을 대표하는 문구는 대시(`-`)로 연결한다.

### `branch type: 대표 내용을 간단한 단어의 조합으로 표기`
**Examples**
- `feat/init-structure`
- `feat/disconnected-push`
- `refactor/rename-variables`
- `fix/wrong-type-declarations`

### Git commit 메세지
---
1. 해당 커밋의 타입을 적는다.
2. 커밋의 내용은 과거 시제를 사용하지 않고, 현재 무엇을 했는지 적고 명령형으로 적어 명확하게 내용을 알 수 있도록 한다.

### `commit type: 현재 형으로 무엇을 했는지 적되, 명령형으로 적기`
**Examples**
- `chore: 빌드 스크립트 추가`
- `doc: README.md에 대한 설명 추가`
- `feat: 통신 끊김 푸쉬 기능 추가`
- `fix: response 메시지 문제 제거`
- `hotfix: production에서 잘못 보내던 메시지 제거`
- `refactor: 4d3d3d3 커밋의 abuser check logic refactoring`
- `style: 탭을 2칸 띄어쓰기로 바꿈`
- `test: PushService에 대한 Mock Test`
- `deps: fluent-logger dependency 삭제`

참고 문헌 : [이 문서](http://karma-runner.github.io/0.10/dev/git-commit-msg.html) 와 [이 문서](https://seesparkbox.com/foundry/semantic_commit_messages)

### Branch Rules
---
- **main** : 이 브랜치는 실제로 서버 Release를 위해 사용되고 있는 브랜치. 실제 배포는 이 브랜치에 MR이 발생할 때 일어남.
- **develop** : 이 브랜치는 서버를 미리 배포해볼 수 있는 브랜치. 실제 배포 전에 이 브랜치에서 확인할 수 있고, 해당 브랜치에 개발한 내역들이 쌓임.
- **그외** : 위에서 설명

[우린 Git-flow를 사용하고 있어요 - 우아한형제들 기술 블로그](https://woowabros.github.io/experience/2017/10/30/baemin-mobile-git-branch-strategy.html)

### Merge 관련
---
- **main ← develop** : Merge commit을 남기는 방법으로 작업하기. 전체적인 커밋 이력이 남는게 main에 더 적합하다고 생각되기 때문!
* main에 배포된 것을 복구하고 싶을 때 → revert를 통해 재배포
- **develop ← feature** :  Squash Commit을 남기는 방법으로 작업하기. develop에는 구체적인 모든 사항을 깔끔하게 정리해서 올리는 것이 맞다고 생각되기 때문!
- conflict가 발생했다면, **git rebase**를 사용하기

[🎢 Git Rebase 활용하기](https://velog.io/@godori/Git-Rebase)

시간이 된다면 이 글도 읽어보면 좋아요!
**(하지만 —force 옵션은 어떤 이슈가 생길지 모르기 때문에 최대한 지양하고 있어요!)**

[Git rebase와 친해지기 (git conflict를 해결하는 방법 & upstream에서 rebase하기)](https://baeji77.github.io/dev/git/etc/git-rebase-and-confilct-resolve/)

**PR 포맷 관련 글은**
[2분 59초 안에 좋은 PR 작성하기](https://hack-jam.tistory.com/29)

### Commit Rules
---
**examples**

```bash
`커밋 종류`: `커밋의 타이틀`

`커밋 내역`
...

example)
feature: cookie update 기능 추가

해당 커밋은 쿠키를 업데이트 하는 기능을 추가하였다.
메소드는 PATCH를 사용하게 하였다.
put말고 patch를 선택한 이유는 전체를 업데이트 하는 것이 아니라 필드 일부를 업데이트하기 때문에 
RESTful API에 따라 PATCH가 더 의미를 가진다고 생각했다.

```

- 최대한 commit 잘게 쪼개기!

### 우리가 일하는 방식
---
1. 로컬 브랜치에서 지속적으로 작업하고, eslint, prettier 적용을 한 상태에서 커밋한다.
2. 작업이 완료되었다면, Remote Repository(Github)에 해당 브랜치를 올린다.
3. Github에서 PR을 생성한다.
4. 해당 PR에 관한 리뷰를 요청한다.
5. 리뷰에서 Approve를 받지 못했다면, 수정 사항을 처리해서 다시 올린다. 
6. Approve를 받았다면, Merge를 진행한다.
