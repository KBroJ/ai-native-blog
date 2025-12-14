# claude-squad 설치 문제 해결 및 진행 기록

## 진행 기록 (2025-12-14)

### 초기 환경 분석

#### 확인한 내용

**Windows 환경**
```powershell
# GitHub CLI 확인
> gh --version
gh version 2.83.1 (2025-11-13)
✅ 상태: 설치 완료

# WSL 버전 확인
> wsl --version
WSL 버전: 2.5.7.0
커널 버전: 6.6.87.1-1
✅ 상태: 설치 완료

# WSL 배포판 확인
> wsl --list --verbose
NAME                   STATE       VERSION
* Ubuntu               Stopped     2
  docker-desktop       Stopped     2
✅ 상태: Ubuntu WSL2 설치됨
```

**WSL Ubuntu 환경**
```bash
# tmux 확인
> wsl -d Ubuntu -- tmux -V
tmux 3.4
✅ 상태: 이미 설치되어 있음!

# GitHub CLI 확인
> wsl -d Ubuntu -- gh --version
zsh:1: command not found: gh
❌ 상태: 설치 필요
```

### 진행 단계

#### 1단계: 환경 분석 ✅
- Windows에 gh 2.83.1 설치 확인
- WSL2 설치 및 활성화 확인
- Ubuntu WSL 배포판 확인
- WSL 내부 tmux 3.4 설치 확인 (이미 설치됨!)
- WSL 내부 gh 미설치 확인

#### 2단계: 문서 작성 ✅
- 설치 가이드 문서 작성
- 문제 해결 및 진행 기록 문서 작성

#### 3단계: 다음 작업 (사용자가 진행)
- [ ] WSL Ubuntu에 gh 설치
- [ ] gh auth login으로 GitHub 인증
- [ ] claude-squad 설치

---

## 발생한 문제 및 해결 방법

### 문제 1: Git Bash에서 tmux 명령을 찾을 수 없음

**증상**
```bash
$ tmux -V
bash: tmux: command not found
```

**원인**
- Git Bash 또는 Windows PowerShell에서 tmux를 직접 실행하려고 시도
- tmux는 Unix/Linux 도구로, Windows 네이티브 환경에서는 실행 불가

**해결 방법**
- WSL Ubuntu 환경에서 실행해야 함
```powershell
# ❌ 작동하지 않음
tmux -V

# ✅ 올바른 방법 1 (PowerShell에서 WSL 명령 실행)
wsl -d Ubuntu -- tmux -V

# ✅ 올바른 방법 2 (WSL 터미널 접속)
wsl
tmux -V
```

**결과**
- WSL 환경에서 tmux 3.4가 이미 설치되어 있음을 확인

---

### 문제 2: sudo apt update 명령이 응답 없이 계속 실행됨

**증상**
```powershell
> wsl -d Ubuntu -- sudo apt update
# 명령이 계속 실행 중이고 응답이 없음
# 타임아웃 발생
```

**시도한 명령**
```powershell
wsl -d Ubuntu -- sudo apt update
# 120초 대기 → timeout
# 추가로 60초 대기 → timeout
# 추가로 120초 대기 → timeout
```

**원인**
- 비대화형 셸(non-interactive shell)에서 sudo 명령 실행 시 비밀번호 프롬프트를 표시할 수 없음
- PowerShell에서 `wsl -- sudo` 형태로 실행하면 비밀번호 입력 프롬프트가 표시되지 않아 무한 대기 상태

**해결 방법**
1. 백그라운드 프로세스 종료
```powershell
# KillShell 도구로 실행 중인 명령 종료
```

2. WSL 터미널을 직접 열고 명령 실행
```bash
# 올바른 방법
wsl  # WSL 터미널 진입
sudo apt update  # 여기서 비밀번호 입력 가능
```

**배운 점**
- WSL에서 sudo가 필요한 명령은 대화형 터미널에서 실행해야 함
- PowerShell에서 `wsl -- sudo` 형태는 비밀번호가 필요 없는 경우에만 사용 가능

---

### 문제 3: Windows에는 gh가 설치되어 있지만 WSL에는 없음

**증상**
```powershell
# Windows에서
> gh --version
gh version 2.83.1 (2025-11-13)
✅ 정상 작동

# WSL에서
> wsl -d Ubuntu -- gh --version
zsh:1: command not found: gh
❌ 명령을 찾을 수 없음
```

**원인**
- Windows와 WSL은 완전히 별도의 독립적인 환경
- Windows에 설치된 프로그램이 WSL에 자동으로 설치되지 않음
- claude-squad는 WSL 환경에서 실행되므로 WSL에 gh가 필요함

**해결 방법**
WSL Ubuntu에 GitHub CLI를 별도로 설치해야 함

```bash
# WSL 터미널에서 실행
wsl

# GitHub CLI 저장소 추가
sudo mkdir -p /etc/apt/keyrings
wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null
sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null

# 설치
sudo apt update
sudo apt install gh -y

# 확인
gh --version
```

**중요 포인트**
- Windows와 WSL은 별도의 파일시스템과 프로그램 환경을 가짐
- 각 환경에 필요한 도구를 개별적으로 설치해야 함
- Windows에서 인증한 gh와 WSL의 gh는 별도로 인증 필요 (`gh auth login`)

---

### 문제 4: PowerShell에서 curl로 claude-squad 설치 시 오류

**증상**
```powershell
> curl -fsSL https://raw.githubusercontent.com/smtg-ai/claude-squad/main/install.sh | bash

Invoke-WebRequest : 매개 변수 이름 'fsSL'과(와) 일치하는 매개 변수를 찾을 수 없습니다.
위치 줄:1 문자:6
+ curl -fsSL https://raw.githubusercontent.com/smtg-ai/claude-squad/mai ...
+      ~~~~~
    + CategoryInfo          : InvalidArgument: (:) [Invoke-WebRequest], ParameterBindingException
    + FullyQualifiedErrorId : NamedParameterNotFound,Microsoft.PowerShell.Commands.InvokeWebRequestCommand
```

**원인**
- PowerShell의 `curl`은 진짜 curl이 아니라 `Invoke-WebRequest`의 별칭(alias)
- `Invoke-WebRequest`는 `-fsSL` 같은 curl 옵션을 지원하지 않음

**PowerShell의 curl 실행 과정**
```powershell
# 입력한 명령
curl -fsSL https://...

# 실제로 실행되는 명령
Invoke-WebRequest -fsSL https://...  # ← -fsSL 옵션이 없어서 오류
```

**curl 비교**

| 환경 | curl의 정체 | `-fsSL` 옵션 |
|------|-----------|-------------|
| PowerShell | `Invoke-WebRequest` 별칭 | ❌ 지원 안 함 |
| Git Bash | 진짜 curl (설치된 경우) | ✅ 지원 |
| WSL Ubuntu | 진짜 curl | ✅ 지원 |

**해결 방법**

방법 1: WSL 터미널에서 직접 실행 (권장)
```bash
# WSL 터미널 열기
wsl

# 설치 명령 실행
curl -fsSL https://raw.githubusercontent.com/smtg-ai/claude-squad/main/install.sh | bash
```

방법 2: PowerShell에서 WSL을 통해 실행
```powershell
wsl bash -c "curl -fsSL https://raw.githubusercontent.com/smtg-ai/claude-squad/main/install.sh | bash"
```

**왜 WSL에서 설치해야 하는가**
1. 설치 스크립트가 Bash 스크립트 (`.sh` 파일)
2. tmux가 필요 (Linux 전용)
3. claude-squad가 Linux 환경 전용 도구

**배운 점**
- PowerShell의 curl은 실제 curl이 아님
- Linux 기반 설치 스크립트는 WSL에서 실행해야 함
- Windows 명령과 Linux 명령을 구분해야 함

---

### 문제 5: WSL 터미널 실행 시 zsh 초기 설정 메시지

**증상**
```bash
> wsl

This is the Z Shell configuration function for new users,
zsh-newuser-install.
You are seeing this message because you have no zsh startup files
(the files .zshenv, .zprofile, .zshrc, .zlogin in the directory
~).  This function can help you with a few settings that should
make your use of the shell easier.

You can:

(q)  Quit and do nothing.  The function will be run again next time.

(0)  Exit, creating the file ~/.zshrc containing just a comment.
     That will prevent this function being run again.

(1)  Continue to the main menu.

(2)  Populate your ~/.zshrc with the configuration recommended
     by the system administrator and exit (you will need to edit
     the file by hand, if so desired).

--- Type one of the keys in parentheses ---
```

**원인**
- WSL Ubuntu가 기본 셸로 zsh (Z Shell)을 사용
- 처음 실행 시 zsh 설정 파일(`.zshrc`)이 없음
- zsh가 자동으로 초기 설정 도우미 실행

**해결 방법**

**옵션 2 선택** (권장)
```bash
--- Type one of the keys in parentheses --- 2
```

**옵션 설명**:
- `q`: 아무것도 하지 않음 (다음에 또 나타남) ❌
- `0`: 빈 `.zshrc` 파일만 생성 (수동 설정 필요) ⚠️
- `1`: 상세 설정 메뉴 진입 (복잡함) ⚠️
- `2`: 시스템 권장 설정 자동 적용 ✅ **권장**

**진행 순서**:
1. `2` 입력 → Enter
2. 자동으로 `~/.zshrc` 파일 생성됨
3. 다음부터 이 메시지 안 나타남
4. 정상적으로 WSL 사용 가능

**zsh란?**
- bash의 향상된 버전
- 더 나은 자동 완성, 명령어 하이라이팅 제공
- Ubuntu WSL의 기본 셸로 채택됨

**배운 점**
- WSL Ubuntu는 zsh를 기본 셸로 사용
- 처음 실행 시 한 번만 설정하면 됨
- `.zshrc` 파일이 zsh 설정을 저장 (bash의 `.bashrc`와 동일한 역할)

---

### 문제 6: claude-squad 설치 시 sudo 비밀번호가 틀렸다고 나옴

**증상**
```bash
> curl -fsSL https://raw.githubusercontent.com/smtg-ai/claude-squad/main/install.sh | bash

Checking for required dependencies...
tmux is already installed.
GitHub CLI (gh) is not installed. Installing GitHub CLI...
Installing GitHub CLI on Debian/Ubuntu...
[sudo] password for kbroj:
# GitHub 비밀번호를 입력했는데 계속 틀렸다고 나옴
```

**원인**
- **sudo가 요구하는 비밀번호는 GitHub 비밀번호가 아님!**
- WSL Ubuntu 시스템 비밀번호를 요구함
- 사용자가 GitHub 비밀번호와 Ubuntu 비밀번호를 혼동

**혼동하기 쉬운 비밀번호들**:
| 비밀번호 | 용도 |
|---------|------|
| Windows 로그인 비밀번호 | Windows 부팅/로그인 |
| GitHub 비밀번호/토큰 | `gh auth login` 시 사용 |
| **WSL Ubuntu 비밀번호** | **sudo 명령 실행 시** ✅ |

**해결 방법**

방법 1: 올바른 비밀번호 입력
```bash
[sudo] password for kbroj: [WSL Ubuntu 비밀번호 입력]
# 화면에 아무것도 안 보이지만 정상!
# 천천히 입력하고 Enter
```

**중요**: Linux는 보안상 비밀번호 입력 시 화면에 아무것도 표시하지 않음
- `*****` 같은 것도 안 나타남
- 커서도 움직이지 않음
- 하지만 입력은 되고 있음!

방법 2: 비밀번호를 잊어버린 경우
```powershell
# PowerShell을 관리자 권한으로 실행

# Ubuntu를 root로 실행
wsl -u root

# 비밀번호 재설정
passwd kbroj

# 새 비밀번호 입력 (2번)
New password: [새 비밀번호]
Retype new password: [새 비밀번호]

# 종료 후 다시 시도
exit
wsl
curl -fsSL https://raw.githubusercontent.com/smtg-ai/claude-squad/main/install.sh | bash
```

**결과**
- 비밀번호 재설정 후 설치 정상 진행됨
- gh 설치가 계속 진행됨

**배운 점**
- sudo 비밀번호 = WSL Ubuntu 시스템 비밀번호
- GitHub 비밀번호와는 완전히 다름
- Linux는 비밀번호 입력 시 화면에 아무것도 표시하지 않음 (보안 기능)
- 비밀번호를 잊었다면 PowerShell 관리자 권한으로 재설정 가능

---

## Windows vs WSL 환경 이해하기

### 핵심 개념

| 항목 | Windows 환경 | WSL Ubuntu 환경 |
|------|-------------|----------------|
| 운영체제 | Windows | Linux (Ubuntu) |
| 패키지 관리자 | Scoop, Chocolatey 등 | apt, apt-get |
| 파일시스템 | `C:\`, `D:\` 등 | `/home/`, `/usr/` 등 |
| 설치된 프로그램 | 독립적 | 독립적 (별도 설치 필요) |
| tmux 사용 | ❌ 불가능 | ✅ 가능 |
| claude-squad 실행 | ❌ 불가능 | ✅ 가능 |

### 왜 WSL을 사용해야 하는가?

1. **tmux는 Linux 도구**
   - Windows 네이티브에서는 실행 불가
   - WSL 환경에서만 정상 작동

2. **claude-squad는 Linux 환경 기반**
   - tmux를 활용한 멀티 세션 관리
   - Unix/Linux 명령어 기반으로 동작

3. **개발 환경 통일**
   - 대부분의 서버 환경이 Linux
   - WSL을 사용하면 동일한 환경에서 개발 가능

---

## 체크리스트

### 설치 완료 항목

#### Windows 환경
- [x] WSL2 설치 (2.5.7.0)
- [x] Ubuntu WSL 배포판 설치
- [x] GitHub CLI 설치 (2.83.1) - Windows용

#### WSL Ubuntu 환경
- [x] tmux 설치 (3.4)
- [ ] GitHub CLI 설치 - **다음 작업**
- [ ] GitHub 인증 (`gh auth login`) - **다음 작업**
- [ ] claude-squad 설치 - **이후 단계**

---

## 추가 참고사항

### PowerShell에서 WSL 명령 실행하기

```powershell
# 형식
wsl -d <배포판> -- <명령>

# 예시
wsl -d Ubuntu -- tmux -V
wsl -d Ubuntu -- ls -la
wsl -d Ubuntu -- pwd

# 배포판 지정 생략 (기본 배포판 사용)
wsl -- tmux -V
wsl ls -la
```

### WSL 터미널 직접 열기

```powershell
# 기본 배포판으로 열기
wsl

# 특정 배포판으로 열기
wsl -d Ubuntu

# 특정 디렉토리에서 열기
wsl -d Ubuntu --cd /home/username/projects
```

### sudo 없이 apt 사용하기 (비권장)

일부 명령은 sudo 없이 실행 가능하지만 설치에는 sudo 필요:
```bash
# 조회만 가능
apt list --installed

# 설치에는 sudo 필요
sudo apt install package-name
```

---

## 다음 단계 가이드

### 1. WSL Ubuntu에 gh 설치

설치 가이드 문서 (`claude-squad-setup-guide.md`)의 "2단계: WSL Ubuntu에 GitHub CLI (gh) 설치" 참조

### 2. GitHub 인증

```bash
wsl
gh auth login
```

### 3. 설치 확인

```bash
gh --version
gh auth status
tmux -V
```

모든 명령이 정상적으로 작동하면 claude-squad 설치 가능!

---

**작성일**: 2025-12-14
**환경**: Windows 10/11, WSL2 2.5.7.0, Ubuntu WSL
