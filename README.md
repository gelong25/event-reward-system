# Event Reward System 

> 사용자가 일정 레벨을 달성 할 때 마다 성장 지원 아이템을 수령할 수 있는 시스템

---

## 설계 의도 
단순히 기능을 구현하는 것이 아닌
"실제로 프로덕션 환경에서 돌아갈 수 있을 만큼 확장성과 명확한 역할 분리가 보장되는 시스템"을 만드는 것을 목표로 함 

### 1. **이벤트 설계**
- 신규 캐릭터를 육성할 때 일정 레벨에 도달하면 아이템을 지급하는 구조입니다.
- 게임 서비스에서는 유저 레벨, 퀘스트 완료 여부, 친구 초대 등 다양한 조건이 이벤트로 활용됩니다.
- 그래서 이벤트 모델에 `condition: string` 필드를 넣고 추후 조건 파서를 붙일 수 있도록 구조화했습니다.
- 현재는 조건을 mock 처리했지만 실제 유저 행동 데이터를 기반으로 DSL이나 스크립팅 시스템으로 확장 가능합니다.

### 2. 역할 기반 권한 분리 이유
- 서비스의 대상은 단순 유저뿐 아니라 운영자(OPERATOR), 감사자(AUDITOR), 관리자(ADMIN)가 포함됩니다.
- 기획자가 요청한 흐름을 반영해 `@Roles()` + `RolesGuard`를 Gateway에서 일괄 처리하여 
각 서비스 내부에서는 역할을 신경 쓰지 않도록 책임을 분리했습니다.



### 3. 유저 요청 구조와 보상 지급 로직
- 유저가 조건을 달성했다고 해서 자동 지급하지 않고 직접 보상 요청을 하도록 설계했습니다.
- 이유: 조건 충족은 유저의 클라이언트/서버 상태에 따라 달라질 수 있고
  운영자가 지급 시점을 명확히 컨트롤할 수 있도록 하기 위함입니다.
- 요청 시에는 중복 방지를 위해 `userId + eventId` 기준으로 인덱스를 구성할 수 있게 설계했습니다.



### 4. MSA 구조를 선택한 이유
- Auth, Event, Gateway를 분리한 이유는 단순하게 과제 항목이라서가 아니라 
  서비스 성장 후 운영 도구, 유저 서비스, 외부 관리자 API 분리 등을 고려한 의도적인 구조화입니다.
- Event 서버는 내부 관리자 도구에서만 접근할 수도 있고  
  Auth는 SSO로 교체될 수도 있기 때문에 각각을 독립시켰습니다.



### 5. API 구조 설계 방식
- API 경로는 직관성과 명확성을 기준으로 설계했습니다.
- 예)
  - `POST /proxy/rewards/request`: 보상 요청
  - `GET /proxy/events`: 이벤트 목록
- Gateway에서 인증/인가를 모두 처리하고 실제 API 라우팅은 내부 서비스에 위임합니다.
- 권한 통제, 로깅, 모니터링 등을 한 곳에서 집중 관리할 수 있다는 장점이 있기 때문입니다. 



### 6. 확장 가능성을 고려한 부분
- 조건 필드는 지금은 단순 문자열이지만 enum + 파라미터 기반 구조로 분리하면
  - `conditionType: "reachLevel", params: { level: 140 }`
  같은 방식으로 다양하게 확장 가능합니다. 
- 보상은 type + amount 구조로 설계해서 포인트, 아이템, 쿠폰 등 자유롭게 표현이 가능합니다. 
- MSA 구조에서 HTTP 통신을 썼지만 차후에는 메시지 브로커나 gRPC 등으로 전환할 수 있도록 인터페이스를 분리하였습니다. 




---

## API 흐름 

1. `POST /auth/signup` → `POST /auth/login` → JWT 발급
2. `POST /proxy/events` (OPERATOR만 가능) → 신규 이벤트 등록 
3. `POST /proxy/rewards` → 이벤트에 연결된 성장 지원 아이템 등록
4. `POST /proxy/rewards/request` → USER가 보상 요청 → 조건 검증 후 지급 여부 기록
5. `GET /proxy/rewards/request?userId=` → 본인 또는 전체 요청 이력 조회

---

## 실행 방법

```bash
docker-compose up --build
```

* Gateway: `http://localhost:3000`
* Auth: `http://localhost:3001`
* Event: `http://localhost:3002`
* MongoDB: `mongodb://localhost:27017`



