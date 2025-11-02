1. 간단한 통합 테스트(예: supertest + jest)로 auth 흐름(등록→로그인→refresh→logout)을 자동화.
2. 프로덕션용 쿠키 보안 설정 검토: sameSite, secure, 도메인/경로.
3. 토큰 블랙리스트/세션관리 확장: 여러 기기/세션을 허용하려면 RefreshToken에 device, ip, lastUsed 등 메타데이터 추가.
4. CI 파이프라인에 migration 적용/검증 단계 추가(현재는 빌드만 수행).