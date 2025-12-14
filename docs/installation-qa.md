# claude-squad 설치 Q&A

## 개요

claude-squad 설치 과정에서 발생한 질문과 답변을 기록하는 문서입니다.

---

## Q1. Windows에 gh를 설치했는데, 왜 WSL에 또 설치해야 하나요?

**질문 날짜**: 2025-12-14

### 질문

분명히 Windows에 gh를 설치했고, 처음 확인할 때도 gh가 설치되어 있다고 했는데, 나중에 WSL에 gh를 추가로 설치했습니다. 왜 그런가요?

### 답변

Windows와 WSL은 **완전히 별개의 운영체제 환경**이기 때문입니다.

#### Windows 환경에서 확인한 gh
```powershell
> gh --version
gh version 2.83.1 (2025-11-13)
✅ Windows에 설치됨
```

#### WSL Ubuntu 환경에서 확인한 gh
```powershell
> wsl -d Ubuntu -- gh --version
zsh:1: command not found: gh
❌ WSL Ubuntu에는 설치 안 됨
```

### Windows vs WSL 환경 비교

```
┌─────────────────────────────────────┐
│         Windows 10/11               │
│                                     │
│  - 운영체제: Windows                 │
│  - 프로그램: gh 2.83.1 ✅           │
│  - 경로: C:\Program Files\...       │
│  - 패키지 관리자: Scoop, Chocolatey │
│                                     │
└─────────────────────────────────────┘
           │
           │ WSL은 Windows 안에서 실행되는
           │ 가상화된 Linux 환경
           ▼
┌─────────────────────────────────────┐
│    WSL Ubuntu (Linux)               │
│                                     │
│  - 운영체제: Linux Ubuntu            │
│  - 프로그램: 독립적으로 설치 필요     │
│  - 경로: /usr/bin/...               │
│  - 패키지 관리자: apt, apt-get      │
│                                     │
└─────────────────────────────────────┘
```

### 비유로 이해하기

- **Windows 환경** = 한국에 있는 집
- **WSL Ubuntu 환경** = 미국에 있는 별장

한국 집에 냉장고를 샀다고 해서 미국 별장에 냉장고가 자동으로 생기지 않습니다.
별장에도 냉장고가 필요하면 따로 사야 하는 것처럼, WSL에도 프로그램을 따로 설치해야 합니다.

### claude-squad는 어디서 실행되나요?

**claude-squad는 WSL Ubuntu 환경에서만 실행됩니다.**

**이유:**
1. tmux는 Linux 전용 도구 (Windows에서 실행 불가)
2. claude-squad는 tmux를 사용해서 동작
3. 따라서 WSL Ubuntu 환경이 필수

**결론:**
WSL Ubuntu 환경에 gh와 tmux가 모두 설치되어 있어야 claude-squad를 사용할 수 있습니다.

### 확인 방법

```powershell
# Windows 환경에서 gh 확인
> gh --version
gh version 2.83.1  # ← Windows용 gh 실행됨

# WSL Ubuntu 환경에서 gh 확인
> wsl -d Ubuntu -- gh --version
command not found  # ← WSL Ubuntu에는 gh가 없음 (설치 필요)
```

### 핵심 포인트

| 항목 | Windows | WSL Ubuntu |
|------|---------|------------|
| gh 설치 위치 | `C:\Program Files\GitHub CLI\` | `/usr/bin/gh` |
| 실행 방법 | `gh --version` | `wsl -- gh --version` |
| 인증 정보 | Windows 전용 | 별도 인증 필요 |
| claude-squad 실행 | ❌ 불가능 | ✅ 가능 |

### 정리

- ✅ **Windows에 gh 설치**: 이미 완료 (2.83.1)
- ❌ **WSL Ubuntu에 gh 설치**: 필요함 (별도 설치)
- **이 둘은 완전히 독립적인 환경입니다!**

---

## Q2. PowerShell에서 curl 명령어로 claude-squad를 설치하려는데 오류가 발생합니다

**질문 날짜**: 2025-12-14

### 질문

PowerShell에서 다음 명령어로 claude-squad를 설치하려고 했는데 오류가 발생했습니다:

```powershell
> curl -fsSL https://raw.githubusercontent.com/smtg-ai/claude-squad/main/install.sh | bash
```

**발생한 오류**:
```
Invoke-WebRequest : 매개 변수 이름 'fsSL'과(와) 일치하는 매개 변수를 찾을 수 없습니다.
위치 줄:1 문자:6
+ curl -fsSL https://raw.githubusercontent.com/smtg-ai/claude-squad/mai ...
+      ~~~~~
    + CategoryInfo          : InvalidArgument: (:) [Invoke-WebRequest], ParameterBindingException
    + FullyQualifiedErrorId : NamedParameterNotFound,Microsoft.PowerShell.Commands.InvokeWebRequestCommand
```

왜 이런 오류가 발생하나요?

### 답변

**PowerShell의 curl은 진짜 curl이 아닙니다!**

#### 문제 원인

PowerShell에서 `curl`은 실제로는 `Invoke-WebRequest`의 별칭(alias)입니다.

```powershell
# PowerShell에서 이렇게 입력하면
curl -fsSL https://...

# 실제로는 이렇게 실행됨
Invoke-WebRequest -fsSL https://...
```

**차이점**:
- **Linux/Unix의 curl**: 진짜 curl 프로그램 (`-fsSL` 옵션 지원)
- **PowerShell의 curl**: `Invoke-WebRequest` 별칭 (`-fsSL` 옵션 없음)

따라서 PowerShell의 `Invoke-WebRequest`는 `-fsSL` 같은 curl 옵션을 이해하지 못합니다.

#### PowerShell vs Bash curl 비교

| 항목 | PowerShell | Bash (Linux/WSL) |
|------|-----------|------------------|
| curl 실체 | `Invoke-WebRequest` 별칭 | 진짜 curl 프로그램 |
| `-f` 옵션 | ❌ 지원 안 함 | ✅ Fail silently |
| `-s` 옵션 | ❌ 지원 안 함 | ✅ Silent mode |
| `-S` 옵션 | ❌ 지원 안 함 | ✅ Show error |
| `-L` 옵션 | ❌ 지원 안 함 | ✅ Follow redirects |

### 올바른 해결 방법

**claude-squad는 WSL 환경에서 설치해야 합니다!**

#### 방법 1: WSL 터미널에서 직접 실행 (권장)

```bash
# 1. WSL 터미널 열기
wsl

# 2. 설치 명령 실행
curl -fsSL https://raw.githubusercontent.com/smtg-ai/claude-squad/main/install.sh | bash
```

#### 방법 2: PowerShell에서 WSL을 통해 실행

```powershell
wsl bash -c "curl -fsSL https://raw.githubusercontent.com/smtg-ai/claude-squad/main/install.sh | bash"
```

### 왜 WSL에서 설치해야 하나요?

claude-squad는 **Linux 환경 전용 도구**이기 때문입니다:

1. **설치 스크립트가 Bash 스크립트** (`.sh` 파일)
2. **tmux 필요** (Linux 전용 도구)
3. **Linux 명령어 사용** (curl, bash 등)

### PowerShell의 curl 별칭 확인하기

```powershell
# curl이 별칭인지 확인
> Get-Alias curl

CommandType     Name                  Version    Source
-----------     ----                  -------    ------
Alias           curl -> Invoke-WebRequest

# 진짜 curl.exe가 있는지 확인 (Git Bash와 함께 설치된 경우)
> where.exe curl
C:\Program Files\Git\mingw64\bin\curl.exe
C:\Windows\System32\curl.exe
```

### 핵심 포인트

| 환경 | curl 명령 | claude-squad 설치 |
|------|----------|-------------------|
| PowerShell | ❌ `Invoke-WebRequest` 별칭 | ❌ 불가능 |
| Git Bash | ⚠️ 진짜 curl (있다면) | ❌ 불가능 (tmux 없음) |
| WSL Ubuntu | ✅ 진짜 curl | ✅ 가능 |

### 정리

- ❌ **PowerShell에서 설치**: curl이 `Invoke-WebRequest` 별칭이라 작동 안 함
- ❌ **Git Bash에서 설치**: tmux가 없어서 claude-squad 실행 불가
- ✅ **WSL Ubuntu에서 설치**: 올바른 방법!

---

## Q3. WSL 터미널을 열면 zsh 초기 설정 메시지가 나타납니다

**질문 날짜**: 2025-12-14

### 질문

`wsl` 명령으로 터미널을 열면 다음과 같은 메시지가 나타납니다:

```
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

어떤 옵션을 선택해야 하나요?

### 답변

이것은 **zsh (Z Shell) 초기 설정 화면**입니다.

#### 왜 이 메시지가 나타나나요?

WSL Ubuntu가 기본 셸(shell)로 zsh를 사용하는데, 처음 실행할 때 설정 파일(`.zshrc`)이 없어서 나타나는 메시지입니다.

#### 권장 선택: `2` 입력

**`2`를 입력하세요** (시스템 권장 설정 사용)

```bash
--- Type one of the keys in parentheses --- 2
```

Enter를 누르면 zsh 설정이 자동으로 완료됩니다.

### 옵션 설명

| 옵션 | 동작 | 추천 여부 | 설명 |
|------|------|----------|------|
| **q** | 아무것도 하지 않음 | ❌ | 다음에 또 이 메시지가 표시됨 |
| **0** | 빈 `.zshrc` 파일 생성 | ⚠️ | 나중에 직접 설정해야 함 |
| **1** | 상세 설정 메뉴로 이동 | ⚠️ | 복잡한 설정 과정 |
| **2** | 시스템 권장 설정 자동 적용 | ✅ **추천** | 바로 사용 가능 |

### zsh란?

**Z Shell (zsh)**은 bash의 향상된 버전으로, 다음과 같은 기능을 제공합니다:
- 더 나은 자동 완성
- 명령어 하이라이팅
- 플러그인 시스템 (oh-my-zsh 등)

Ubuntu WSL이 기본 셸로 zsh를 채택한 경우입니다.

### 진행 순서

1. **`2` 입력** 후 Enter
2. zsh 설정 완료 확인
3. 이제 일반적인 Linux 명령어 사용 가능
4. claude-squad 설치 진행:
   ```bash
   curl -fsSL https://raw.githubusercontent.com/smtg-ai/claude-squad/main/install.sh | bash
   ```

### 나중에 설정 변경하려면

zsh 설정은 `~/.zshrc` 파일을 편집하면 됩니다:

```bash
# 설정 파일 편집
nano ~/.zshrc

# 또는
vim ~/.zshrc

# 변경 후 적용
source ~/.zshrc
```

### 핵심 포인트

- ✅ **옵션 2 선택**: 가장 빠르고 쉬운 방법
- 📝 `.zshrc`: zsh 설정 파일 (bash의 `.bashrc`와 동일한 역할)
- 🔄 **한 번만 설정**: 설정 후 다시 나타나지 않음

---

## Q4. claude-squad 설치 시 sudo 비밀번호가 계속 틀렸다고 나옵니다

**질문 날짜**: 2025-12-14

### 질문

claude-squad 설치 중에 다음과 같은 메시지가 나타나는데, 비밀번호를 입력해도 계속 틀렸다고 합니다:

```bash
> curl -fsSL https://raw.githubusercontent.com/smtg-ai/claude-squad/main/install.sh | bash

Checking for required dependencies...
tmux is already installed.
GitHub CLI (gh) is not installed. Installing GitHub CLI...
Installing GitHub CLI on Debian/Ubuntu...
[sudo] password for kbroj:
# 비밀번호를 입력해도 계속 틀렸다고 나옴
```

GitHub 비밀번호를 입력했는데 왜 안 되나요?

### 답변

**이것은 GitHub 비밀번호가 아니라 Ubuntu 시스템 비밀번호입니다!**

#### 혼동하기 쉬운 비밀번호들

| 비밀번호 종류 | 용도 | 언제 사용 |
|-------------|------|----------|
| **Windows 로그인 비밀번호** | Windows 시스템 | Windows 부팅, 로그인 |
| **GitHub 비밀번호/토큰** | GitHub 계정 | `gh auth login` 시 |
| **WSL Ubuntu 비밀번호** | Linux 시스템 관리 | `sudo` 명령 실행 시 ✅ |

#### sudo가 요구하는 비밀번호

`[sudo] password for kbroj:` 메시지는 **WSL Ubuntu 시스템 비밀번호**를 요구합니다.

- ❌ GitHub 비밀번호 아님
- ❌ Windows 로그인 비밀번호 아님
- ✅ **WSL Ubuntu를 처음 설치할 때 설정한 비밀번호**

### 추가로 알아야 할 것

#### 1. 비밀번호 입력 시 화면에 아무것도 안 나타남

**이것은 정상입니다!**

```bash
[sudo] password for kbroj: _
# 여기서 비밀번호를 입력해도 화면에 아무것도 안 보임
# *, 점, 커서 움직임 등 아무것도 표시 안 됨
# 하지만 입력은 되고 있습니다!
```

Linux는 보안상 이유로 비밀번호 입력 시 **어떠한 피드백도 표시하지 않습니다**.

**올바른 입력 방법**:
1. 비밀번호를 천천히 정확하게 입력
2. 화면에 아무것도 안 보여도 계속 입력
3. Enter 키 누름

#### 2. 비밀번호를 잊어버린 경우

WSL Ubuntu 비밀번호를 잊어버렸다면 재설정할 수 있습니다.

**비밀번호 재설정 방법**:

```powershell
# 1. PowerShell을 관리자 권한으로 실행 (중요!)

# 2. Ubuntu를 root 사용자로 실행
wsl -u root

# 3. 비밀번호 재설정 (kbroj는 사용자명으로 변경)
passwd kbroj

# 4. 새 비밀번호 입력 (2번 입력)
New password: [새 비밀번호 입력]
Retype new password: [새 비밀번호 다시 입력]

# 5. 성공 메시지 확인
passwd: password updated successfully

# 6. root 셸 종료
exit

# 7. 다시 WSL 접속
wsl

# 8. 설치 명령 다시 실행
curl -fsSL https://raw.githubusercontent.com/smtg-ai/claude-squad/main/install.sh | bash
```

### 문제 해결 체크리스트

- [ ] Ubuntu 시스템 비밀번호를 입력하고 있는가? (GitHub 비밀번호 아님)
- [ ] 화면에 아무것도 안 보여도 입력하고 Enter를 눌렀는가?
- [ ] 오타 없이 정확하게 입력했는가?
- [ ] 비밀번호를 잊어버렸다면 위의 재설정 방법을 사용했는가?

### 핵심 포인트

- 🔑 **sudo 비밀번호 = WSL Ubuntu 시스템 비밀번호**
- 👁️ **화면에 아무것도 안 보이는 것은 정상** (보안 기능)
- 🔄 **비밀번호를 잊었다면 PowerShell 관리자 권한으로 재설정 가능**
- ❌ **GitHub 비밀번호가 아님!**

### 정리

- WSL Ubuntu를 처음 설치할 때 설정한 비밀번호 사용
- 비밀번호 입력 시 화면에 아무것도 표시 안 됨 (정상)
- 잊어버렸다면 PowerShell 관리자 권한으로 재설정 가능

---

## 다음 질문을 추가하려면...

이 문서에 계속해서 Q&A를 추가할 예정입니다.
질문이 생기면 언제든지 말씀해주세요!

---

**마지막 업데이트**: 2025-12-14
