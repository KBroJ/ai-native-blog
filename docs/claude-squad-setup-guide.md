# claude-squad 설치 가이드 (Windows 환경)

## 개요

claude-squad를 Windows 환경에서 사용하기 위한 사전 준비 가이드입니다.

## 필수 요구사항

claude-squad는 WSL(Windows Subsystem for Linux) 환경에서 실행됩니다.
다음 도구들이 **WSL Ubuntu 내부**에 설치되어 있어야 합니다:

- tmux (터미널 멀티플렉서)
- GitHub CLI (gh)

## 환경 확인

### Windows에 WSL2가 설치되어 있는지 확인

```powershell
wsl --version
```

설치되어 있지 않다면:
```powershell
# PowerShell 관리자 권한으로 실행
wsl --install
# 재부팅 필요
```

### WSL Ubuntu 배포판 확인

```powershell
wsl --list --verbose
```

Ubuntu가 없다면:
```powershell
wsl --install -d Ubuntu
```

## 1단계: WSL Ubuntu에서 tmux 확인

### tmux가 설치되어 있는지 확인

```powershell
wsl -d Ubuntu -- tmux -V
```

### tmux 설치 (설치되지 않은 경우)

```bash
# WSL 터미널 열기
wsl

# 패키지 목록 업데이트
sudo apt update

# tmux 설치
sudo apt install tmux -y

# 설치 확인
tmux -V
```

## 2단계: WSL Ubuntu에 GitHub CLI (gh) 설치

### gh 설치 확인

```powershell
wsl -d Ubuntu -- gh --version
```

### gh 설치

```bash
# WSL 터미널 열기
wsl

# GitHub CLI 저장소 추가
sudo mkdir -p /etc/apt/keyrings
wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null
sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null

# 패키지 업데이트 및 gh 설치
sudo apt update
sudo apt install gh -y

# 설치 확인
gh --version
```

## 3단계: GitHub 인증

```bash
# WSL 터미널에서 실행
gh auth login
```

프롬프트에 따라 진행:
1. GitHub.com 선택
2. HTTPS 선택
3. 브라우저 또는 토큰으로 인증

## 4단계: 설치 확인

모든 도구가 정상 작동하는지 확인:

```bash
# WSL 터미널에서 실행
wsl

# tmux 확인
tmux -V

# gh 확인
gh --version

# gh 인증 상태 확인
gh auth status
```

## tmux 기본 사용법

### 세션 시작
```bash
tmux new -s session-name
```

### 세션에서 분리 (Detach)
- `Ctrl + B`, 그 다음 `D` 키

### 세션 목록 보기
```bash
tmux ls
```

### 세션에 다시 연결
```bash
tmux attach -t session-name
```

### 세션 종료
```bash
tmux kill-session -t session-name
```

## 다음 단계

모든 설치가 완료되었다면 claude-squad를 설치하고 사용할 수 있습니다.

## 참고 자료

- [tmux 공식 문서](https://github.com/tmux/tmux/wiki)
- [GitHub CLI 공식 문서](https://cli.github.com/)
- [WSL 공식 가이드](https://learn.microsoft.com/ko-kr/windows/wsl/install)

---

**마지막 업데이트**: 2025-12-14
