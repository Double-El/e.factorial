import pygame

pygame.init()

# Try to use a default system font that supports Korean
font = pygame.font.SysFont(["malgun", "gulim", "batang", "Arial Unicode MS"], 40)

# Initialize Pygame screen
screen = pygame.display.set_mode((800, 600))
screen.fill((255, 255, 255))

# Render Korean text
text_surface = font.render("안녕하세요! 한글 테스트", True, (0, 0, 0))
screen.blit(text_surface, (100, 100))

pygame.display.update()
pygame.time.delay(3000)  # Show for 3 seconds
pygame.quit()
